import { ec } from "elliptic";
const EC = new ec("secp256k1")

export default EC

// export default function createWallet(){
//     const key = EC.genKeyPair()

//     const publicKey = key.getPublic('hex')
//     const privateKey = key.getPrivate('hex')

//     console.log('---------------------- PRIVATE KEY ----------------------')
//     console.log(privateKey)
//     console.log('---------------------- PUBLIC KEY ----------------------')
//     console.log(publicKey)
// }