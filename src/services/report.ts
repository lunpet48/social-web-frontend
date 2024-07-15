export const sendReport = async (targetId: string, message: string, reportType: string) => {
  const access_token = localStorage.getItem('token');
  const response = await fetch(`${process.env.API}/api/v1/report`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      reportType: reportType,
      reportedId: targetId,
      describe: message,
    }),
  });
  return response;
};
