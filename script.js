
if (window.solanaWeb3) {
    const { Connection, clusterApiUrl } = solanaWeb3;

    function connectToSolana(network = 'devnet') {
        const connection = new Connection(clusterApiUrl(network), 'confirmed');
        console.log(`Connected to Solana ${network}`);
        return connection;
    }

    const connection = connectToSolana();

}
    
function isBackpackInstalled() {
    return window.backpack && window.backpack.isBackpack;
}

async function connectToBackpack() {
    if (isBackpackInstalled()) {
        try {
            const resp = await window.backpack.connect();
            console.log('Connected to Backpack wallet:', resp.publicKey.toString());
            return resp.publicKey;
        } catch (err) {
            console.error('Error connecting to Backpack wallet:', err);
        }
    } else {
        console.error('Backpack wallet is not installed');
    }
}

const connectButton = document.getElementById('connectWallet');
if (connectButton) {
    connectButton.addEventListener('click', async () => {
        const publicKey = await connectToBackpack();
        if (publicKey) {
            console.log('Connected public key:', publicKey.toString());
            // Perform additional actions with the connected wallet
        }
    });
}




let form = document.querySelector('form')
form.addEventListener('submit', function(){
     event.preventDefault();
     const formData = new FormData(form);
     const publickey = formData.get('#publickey');
     const amount = formData.get('#amount');
     const tokenType = formData.get('#tokenType');
     const loadingMessage = document.getElementById('loadingMessage');
     const successMessage = document.getElementById('successMessage');
     const errorMessage = document.getElementById('errorMessage');



    if (!isValidPublicKey(publickey)){
        alert('Invalid public key!');
        return;
    }

    if (!isValidAmount(amount)){
        alert('Invalid amount');
        return;
    }
    
    if (!isValidTokenType(tokenType)) {
    alert('Please select a token type!');
    return;
    }

    async function connectToBackpack() {
        if (isBackpackInstalled()) {
            try {
                const resp = await window.backpack.connect();
                console.log('Connected to Backpack wallet:', resp.publicKey.toString());
                publicKey = resp.publicKey;
                return publicKey;
            } catch (err) {
                console.error('Error connecting to Backpack wallet:', err);
            }
        } else {
            console.error('Backpack wallet is not installed');
        }
    }

    async function sendTokens(receiverAddress, amount) {
        try {
            const fromPublicKey = publicKey;
            const toPublicKey = new PublicKey(receiverAddress);
            const lamports = amount * solanaWeb3.LAMPORTS_PER_SOL; // Convert SOL to lamports
    
            // Create a transaction
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: fromPublicKey,
                    toPubkey: toPublicKey,
                    lamports,
                })
            );
    
            // Sign and send the transaction
            const { signature } = await window.backpack.signAndSendTransaction(transaction);
            console.log('Transaction sent with signature:', signature);
            successMessage.style.display = 'block';
        } catch (error) {
            console.error('Error sending tokens:', error);
            errorMessage.style.display = 'block';
        } finally {
            loadingMessage.style.display = 'none'; // Hide the loading message
        }
    }

    const sendButton = document.getElementById('sendTokens');
if (sendButton) {
    sendButton.addEventListener('click', async () => {
        const receiverAddress = 'ReceiverSolanaPublicKeyHere'; // Replace with the actual receiver's public key
        const amount = 0.1; // Amount in SOL
        await sendTokens(receiverAddress, amount);
    });
}

    form.reset();

    //  console.log('form sumbited')
});

function isValidPublicKey(publicKey) {
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(publicKey);
    return isValid;
}

function isValidAmount(amount) {
    const amountValue = parseFloat(amount);
    return !isNaN(amountValue) && amountValue > 0;
}

function isValidTokenType(tokenType) {
    return tokenType !== "";
}

function isBackpackInstalled() {
    return window.backpack && window.backpack.isBackpack;
}

