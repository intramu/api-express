import { ManagementClient } from "auth0";

const auth0 = new ManagementClient({
    domain: "dev-5p-an07k.us.auth0.com",
    clientId: "kJSlepUUcaMHM5Qi4DOcsOkTToZtOpie",
    clientSecret: "Pgtyf53JVpnnjn_RlpVHDSDgSp4Vqzwqg3J7RQdtnL7l6oNLVUzJPjYDfY2MrakM",
    scope: "update:users",
});

class MATokenGenerator {
    public async getToken() {
        try {
            const token = await auth0.getAccessToken();
            return token;
        } catch (error) {
            console.log("Error in MATokenGenerator");

            // console.log(error);
            return null;
        }
    }
}

export default MATokenGenerator;
