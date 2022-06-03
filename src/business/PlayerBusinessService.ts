// import playerDAO from "../database/playerDAO";
// import { Player } from "../models/Player";

// const databasePlayer = new playerDAO();

// export class PlayerBusinessService{
//     public createPrimary(player: Player, callback: any){
//         databasePlayer.createPrimary(player, (result:any)=>{
//             if(result === null){
//                 console.log('Database Error');
//                 callback({message: "Primary Player NOT Created", code: -1})
//             }

//             if(result > 0)
//                 callback({message: "Primary Player Created", code: result})
//             else
//                 callback({message: "Primary Player NOT Created", code: result})
//         })
//     }

//     public createSecondary(player: Player, callback: any){

//     }
// }
