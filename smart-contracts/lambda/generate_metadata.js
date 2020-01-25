exports.handler = async (event, context) => {
    const tokenId = event.queryStringParameters.tokenId;

    if(tokenId == null) return { statusCode: 400, body: `Invalid query, please pass token id to \`tokenId\` query params.` }
    
    return {
      statusCode: 200,
      body: `Hello, ${tokenId}`
    };
  };