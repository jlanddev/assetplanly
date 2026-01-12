import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lastName = searchParams.get('lastName');
  const firstName = searchParams.get('firstName');

  if (!lastName) {
    return NextResponse.json({ error: 'Last name is required' }, { status: 400 });
  }

  try {
    // Query SEC IAPD database
    const secUrl = `https://api.adviserinfo.sec.gov/IAPD/Content/Search/SearchIndividuals?query=${encodeURIComponent(lastName)}${firstName ? '%20' + encodeURIComponent(firstName) : ''}&pageNumber=1&pageSize=20`;

    const response = await fetch(secUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; AssetPlanly/1.0)'
      }
    });

    if (!response.ok) {
      // Try alternative endpoint
      const altUrl = `https://api.adviserinfo.sec.gov/IAPD/Content/Search/SearchIndvlSummary?query=${encodeURIComponent(lastName)}&pageNumber=1&pageSize=20`;

      const altResponse = await fetch(altUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; AssetPlanly/1.0)'
        }
      });

      if (altResponse.ok) {
        const altData = await altResponse.json();
        return NextResponse.json(formatResults(altData));
      }

      throw new Error('SEC API unavailable');
    }

    const data = await response.json();
    return NextResponse.json(formatResults(data));

  } catch (error) {
    console.error('SEC API error:', error);

    // Return empty results with option to continue manually
    return NextResponse.json({
      success: true,
      results: [],
      message: 'Unable to reach SEC database. You can continue with manual entry.',
      allowManual: true
    });
  }
}

function formatResults(data) {
  let results = [];

  // Handle SEC API response format
  if (data?.hits?.hits) {
    results = data.hits.hits.map(hit => ({
      crdNumber: hit._source?.indvl_pk || hit._source?.ind_source_id,
      name: `${hit._source?.ind_firstname || ''} ${hit._source?.ind_lastname || ''}`.trim(),
      firstName: hit._source?.ind_firstname,
      lastName: hit._source?.ind_lastname,
      firmName: hit._source?.org_name || hit._source?.current_emp,
      firmCrd: hit._source?.org_pk,
      city: hit._source?.ind_city,
      state: hit._source?.ind_state,
      status: 'Active'
    }));
  } else if (data?.Results) {
    results = data.Results.map(item => ({
      crdNumber: item.IndividualCRD || item.CRDNumber,
      name: item.IndividualName || `${item.FirstName || ''} ${item.LastName || ''}`.trim(),
      firstName: item.FirstName,
      lastName: item.LastName,
      firmName: item.CurrentEmployer || item.FirmName,
      firmCrd: item.FirmCRD,
      city: item.City,
      state: item.State,
      status: item.Status || 'Active'
    }));
  } else if (data?.Hits) {
    results = data.Hits.map(item => ({
      crdNumber: item.IndividualCRD || item.Id,
      name: item.Name || `${item.FirstName || ''} ${item.LastName || ''}`.trim(),
      firstName: item.FirstName,
      lastName: item.LastName,
      firmName: item.CurrentEmployment || item.FirmName,
      city: item.City,
      state: item.State,
      status: 'Active'
    }));
  }

  return {
    success: true,
    count: results.length,
    results: results.filter(r => r.name)
  };
}
