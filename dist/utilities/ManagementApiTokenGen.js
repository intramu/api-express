"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth0_1 = require("auth0");
const auth0 = new auth0_1.ManagementClient({
    domain: "dev-5p-an07k.us.auth0.com",
    clientId: "kJSlepUUcaMHM5Qi4DOcsOkTToZtOpie",
    clientSecret: "Pgtyf53JVpnnjn_RlpVHDSDgSp4Vqzwqg3J7RQdtnL7l6oNLVUzJPjYDfY2MrakM",
    scope: "update:users",
});
class MATokenGenerator {
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let token = yield auth0.getAccessToken();
                return token;
            }
            catch (error) {
                console.log("Error in MATokenGenerator");
                // console.log(error);
                return null;
            }
        });
    }
}
exports.default = MATokenGenerator;
