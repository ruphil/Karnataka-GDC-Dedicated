export const wsMsgHandler = (event: any) => {
    // console.log(event.data);
    let responseObj = JSON.parse(Buffer.from(event.data, 'base64').toString());
    console.log(responseObj);
}