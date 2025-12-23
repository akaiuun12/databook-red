export const handler = async (event: any) => {
  const { code } = event.queryStringParameters;
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  try {
    // Exchange the code for an access token
    const response = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const data: any = await response.json();

    if (data.error) {
      return {
        statusCode: 400,
        body: `Error: ${data.error_description}`,
      };
    }

    // This is the format Decap CMS expects to receive the token
    const postMessage = `
      <script>
        (function() {
          function recieveMessage(e) {
            console.log("Recieve message:", e);
            window.opener.postMessage(
              'authorization:github:success:${JSON.stringify({
                token: data.access_token,
                provider: 'github',
              })}',
              e.origin
            );
          }
          window.addEventListener("message", recieveMessage, false);
          window.opener.postMessage("authorizing:github", "*");
        })()
      </script>
    `;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: postMessage,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error: ${error}`,
    };
  }
};

