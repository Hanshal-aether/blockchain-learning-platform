let wallet = {};

// Create Wallet
async function createWallet() {

const keyPair = await crypto.subtle.generateKey(
{
name: "ECDSA",
namedCurve: "P-256"
},
true,
["sign","verify"]
);

wallet.private = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
wallet.public = await crypto.subtle.exportKey("jwk", keyPair.publicKey);

document.getElementById("privateKey").value =
JSON.stringify(wallet.private);

document.getElementById("address").value =
JSON.stringify(wallet.public);
}

// Sign
async function signMessage(){

if(!wallet.private){
alert("Create wallet first");
return;
}

const msg = document.getElementById("message").value;

const key = await crypto.subtle.importKey(
"jwk",
wallet.private,
{name:"ECDSA",namedCurve:"P-256"},
true,
["sign"]
);

const data = new TextEncoder().encode(msg);

const sig = await crypto.subtle.sign(
{name:"ECDSA",hash:"SHA-256"},
key,
data
);

document.getElementById("signature").value =
btoa(String.fromCharCode(...new Uint8Array(sig)));
}

// Verify
async function verify(){

const msg = document.getElementById("message").value;
const sig = document.getElementById("signature").value;

const key = await crypto.subtle.importKey(
"jwk",
wallet.public,
{name:"ECDSA",namedCurve:"P-256"},
true,
["verify"]
);

const data = new TextEncoder().encode(msg);

const sign = Uint8Array.from(atob(sig),c=>c.charCodeAt(0));

const valid = await crypto.subtle.verify(
{name:"ECDSA",hash:"SHA-256"},
key,
sign,
data
);

document.getElementById("result").innerText =
valid ? "Valid Signature ✅" : "Invalid ❌";
}