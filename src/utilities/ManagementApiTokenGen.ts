import { ManagementClient } from "auth0";

export const auth0 = new ManagementClient({
    domain: "dev-5p-an07k.us.auth0.com",
    clientId: "kJSlepUUcaMHM5Qi4DOcsOkTToZtOpie",
    clientSecret: "Pgtyf53JVpnnjn_RlpVHDSDgSp4Vqzwqg3J7RQdtnL7l6oNLVUzJPjYDfY2MrakM",
});

// eslint-disable-next-line class-methods-use-this
export async function getToken() {
    try {
        const token = await auth0.getAccessToken();
        return token;
    } catch (error) {
        console.log("Error in MATokenGenerator");

        // console.log(error);
        return null;
    }
}

