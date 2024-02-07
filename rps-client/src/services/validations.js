import toast from "react-hot-toast";

export function validateAddress(addr){
    console.log("Vlidating Address: ", addr)
    let regex = new RegExp(/^(0x)?[0-9a-fA-F]{40}$/);

    // if str
    // is empty return false
    if (addr == null) {
        return false;
        toast('Address cannot be empty');
    }
  
    // Return true if the str
    // matched the ReGex
    if (regex.test(addr) == true) {
        return true;
    }
    else {
        return false;
        toast('Enter a valid Address')
    }
}

export function validateAmount(amount){
    console.log("Amount: ", amount);
    if(amount == null){
        return false;
        toast('Amount cannot be empty')
    }

    if(amount>0){
        return true;
    }else{
        return false;
        toast('Enter a valid amount')
    }
}

export function validateMove(move){
    console.log("Selected MOVE: ", move);
    if(move == null){
        return false;
        toast('Plese Choose a move')
    }

    if(move == 1 || move == 2 || move == 3 || move == 4 || move == 5){
        return true
    }else{
        return false
        toast('Please Choose your move')
    }
}

export function validateSalt(salt){
    console.log("Salt: ", salt);
    let regex = new RegExp(/^(0x)?[0-9a-fA-F]{64}$/);

    if (salt == null) {
        return false;
        toast('Invalid Salt');
    }

    if (regex.test(salt) == true) {
        return true;
    }
    else {
        return false;
        toast('Invalid Salt')
    }
}