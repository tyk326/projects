import { clientID, clientSecret } from '../../clientinfo'

export let token: string = '';

export async function getToken(){
    const body = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientID,
        client_secret: clientSecret,
    });

    try{
        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        });
        const data = await res.json(); //to get the actual data
        token = data.access_token;
    }
    catch (err){
        console.log(err);
    }
    return token;
}
