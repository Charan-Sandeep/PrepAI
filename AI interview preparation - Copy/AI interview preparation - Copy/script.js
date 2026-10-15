// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL = "https://pzbsaarxsgwnrvlfkhpz.supabase.co";

const SUPABASE_KEY = "sb_publishable_D1WCERRk-S-sYDA-QZtyAw_h7UH7pkO";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


// ==========================================
// SHOW SUCCESS MESSAGE
// ==========================================

function showSuccessMessage(message) {

    // Remove the login/create account form
    document.getElementById("authPage").innerHTML = "";

    // Display only the message
    document.getElementById("message").textContent = message;
}


// ==========================================
// CREATE ACCOUNT
// ==========================================

async function createAccount() {

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;


    // Check empty fields
    if (!email || !password) {

        alert("Please enter email and password");

        return;
    }


    const { data, error } = await supabaseClient.auth.signUp({

        email: email,

        password: password

    });


    // Error
    if (error) {

        console.error(error);

        alert("Account creation failed: " + error.message);

        return;
    }


    // Successful account creation
    console.log("Account created:", data);
    const loginTab = document.getElementById("loginTab");
    const message = document.getElementById("message");
    if (loginTab && message) {
        message.textContent = data.session
            ? "Account created. Please log in to continue."
            : "Account created. Confirm your email, then log in to continue.";
        loginTab.click();
    } else if (message) {
        message.textContent = data.session
            ? "Account created. Please log in to continue."
            : "Account created. Confirm your email, then log in to continue.";
    } else {
        showSuccessMessage("Account created. Please log in to continue.");
    }
}


// ==========================================
// LOGIN
// ==========================================

async function login() {

    const email = document.getElementById("loginEmail").value;

    const password = document.getElementById("loginPassword").value;


    // Check empty fields
    if (!email || !password) {

        alert("Please enter email and password");

        return;
    }


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


    // Login error
    if (error) {

        console.error(error);

        alert("Login failed: " + error.message);

        return;
    }


    // Successful login
    console.log("Logged in:", data.user);

    window.location.replace("dashboard.html");
}
