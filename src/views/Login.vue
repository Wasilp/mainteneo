<template>
<div id="login">
    <transition name="fade">
        <div v-if="performingRequest" class="loading">
            <p>Loading...</p>
        </div>
    </transition>
    <section>
        <div class="col1 text-xs-right">
            <div class="pr-5">
                <img src="@/assets/images/logo-large-white.png" height="70px;" style="margin-top: 10px;">
            </div>
            <div class="mainteneo-tagline mt-4 pr-5">The App for HVACR Professionnals</div>
        </div>

        <div class="col2" :class="{ 'signup-form': !showLoginForm && !showForgotPassword }">
            <form v-if="showLoginForm" @submit.prevent>
                <h1>Welcome back</h1>

                <v-form class="mb-4">

                    <VuePhoneNumberInput v-model="loginForm.phoneNumber" @update="countryChanged" prepend-icon="phone" name="login" :label="this.$i18n.t('views.login.login')" placeholder="+32478096723" type="text" color="#5071b6" />

                </v-form>
                <v-btn @click="LogNum" round large dark color="#00acc1">LogIn</v-btn>
                <!-- <v-btn @click="logout" round large dark color="black">Logout</v-btn>
          <div class="extras">
            <a @click="togglePasswordReset">Forgot Password</a>
          </div> -->
            </form>



            <form v-if="showCodeForm" @submit.prevent>
                <h1>Verification code</h1>

                <v-form class="mb-4">
                    <v-text-field v-model.trim="loginForm.code" prepend-icon="password" name="login" type="password" :label="this.$i18n.t('views.login.password')" placeholder="Password" color="#5071b6"></v-text-field>
                </v-form>


                <v-btn @click="login" round large dark color="#00acc1">LogIn</v-btn>
                <!-- <v-btn @click="logout" round large dark color="black">Logout</v-btn>
          <div class="extras">
            <a @click="togglePasswordReset">Forgot Password</a>
          </div> -->
            </form>

            <!-- <v-form class="mb-4">
            <v-text-field
              v-model.trim="loginForm.password"
              prepend-icon="password"
              name="login"
              type="password"
              :label="this.$i18n.t('views.login.password')"
              placeholder="Password"
              color="#5071b6"
            ></v-text-field>
          </v-form> -->



            <!-- <form v-if="showForgotPassword" @submit.prevent class="password-reset">
          <div v-if="!passwordResetSuccess">
            <h1>Reset password</h1>
            <p>We will send you an email to reset your password</p>

            <v-form class="mb-4">
              <v-text-field
                v-model.trim="passwordForm.email"
                name="email"
                :label="email"
                placeholder="you@email.com"
                type="text"
                color="#5071b6"
              ></v-text-field>
            </v-form>

            <v-btn @click="resetPassword" round large dark color="#00acc1">Submit</v-btn>

            <div class="extras">
              <a @click="togglePasswordReset">Back to Log In</a>
            </div>
          </div>
          <div v-else>
            <h1>Email Sent</h1>
            <p>check your email for a link to reset your password</p>
            <button @click="togglePasswordReset" class="button">Back to login</button>
          </div>
        </form> -->

            <transition name="fade">
                <div v-if="errorMsg !== ''" class="error-msg">
                    <p>{{ errorMsg }}</p>
                </div>
            </transition>
        </div>
    </section>
</div>
</template>

<script>
import VuePhoneNumberInput from 'vue-phone-number-input';
const fb = require("../firebaseConfig.js");
const Users = require('../store/modules/users.js')
export default {
    components: {
        VuePhoneNumberInput,
    },
    data() {
        return {

            loginForm: {
                code: '',
                phoneNumber: '',
                countryCode: ''
            },
            signupForm: {
                name: "",
                title: "",
                email: "",
                password: ""
            },
            passwordForm: {
                email: ""
            },
            countryCode: '',
            phoneNumber: '',
            showLoginForm: true,
            showForgotPassword: false,
            passwordResetSuccess: false,
            performingRequest: false,
            showCodeForm: false,
            errorMsg: ""
        };
    },
    methods: {


        toggleForm() {
            this.errorMsg = "";
            this.showLoginForm = !this.showLoginForm;
        },
        togglePasswordReset() {
            this.errorMsg = "";
            if (this.showForgotPassword) {
                this.showLoginForm = true;
                this.showForgotPassword = false;
                this.passwordResetSuccess = false;
            } else {
                this.showLoginForm = false;
                this.showForgotPassword = true;
            }
        },
        // FUNCTION To save and split the phone number
        countryChanged(phoneMeta) {

            console.log(phoneMeta.countryCallingCode)
            this.loginForm.countryCode = phoneMeta.countryCallingCode
        },
        LogNum() {
            this.showCodeForm = true
            this.showLoginForm = false
            console.log(this.loginForm.phoneNumber, 'KIKOU')

            Users.actions.authRequest(this.loginForm).then((response) => {
                    console.log('[auth request] ' + JSON.stringify(response));
                    if (response.status === 'success') {
                        //new auth
                        console.log(response);
                        console.log('-------')
                        console.log(response)
                    }
                 else if (response.status === 'error') {
                    this.errorMsg = response.message;
                }
            })
        },
        // Function who's calling authRequest in the store to connect with custom Token created from API
        login() {
            var authWithCode = fb.functions.httpsCallable('authWithCode');

            console.log(this.loginForm.phoneNumber, 'KIKOU')
            // var authWithCodeRequestFunction = fb.functions.httpsCallable('authWithCode');
            const data = {
                countryCode: this.loginForm.countryCode,
                phoneNumber: this.loginForm.phoneNumber,
                verificationCode: this.loginForm.code
            }


            authWithCode(data).then((response) => {
                fb.auth.signInWithCustomToken(response.data.customToken).then((response) => {
                    var currentUser = fb.auth.currentUser;
                    console.log(JSON.stringify(currentUser));
                    this.$store.commit("SET_CURRENT_USER", currentUser);
                    this.$store.dispatch("fetchUserProfile");
                    this.$router.push("/dashboard");
                })
            })
    },
    logout() {
        fb.auth.signOut()
            .then(() => {
                console.log('signout')
            })
            .catch((error) => {
                console.log('[logout] errror :' + JSON.stringify(error))
            })
    },
    resetPassword() {
        //this.performingRequest = true;
        fb.auth
            .sendPasswordResetEmail(this.passwordForm.email)
            .then(() => {
                //this.performingRequest = false;
                this.passwordResetSuccess = true;
                this.passwordForm.email = "";
            })
            .catch(err => {
                console.log(err);
                //this.performingRequest = false;
                this.errorMsg = err.message;
            });
    }
}
};
</script>
<style scoped>
body {
    margin: 0;
    color: #34495e;
    background: #e6ecf0;
}

html {
    line-height: 1.15;
    -webkit-text-size-adjust: 100%;
}

* {
    font-family: "Roboto", sans-serif;
    box-sizing: border-box;
    transition: 0.15s;
}

*:focus {
    outline: none;
}

h1,
h2,
h3,
h4,
h5,
p {
    margin: 0 0 0.5rem;
}

h1 {
    font-size: 2rem;
}

h2 {
    font-size: 1.8rem;
}

h3 {
    font-size: 1.6rem;
}

h4 {
    font-size: 1.4rem;
}

h5 {
    font-size: 1.2rem;
}

p {
    line-height: 1.5;
}

a {
    font-family: "Roboto", sans-serif;
    text-decoration: none;
    color: #5071b6;
    margin: 0;
    cursor: pointer;
}

a:hover {
    color: #6280be;
}

section {
    display: flex;
    max-width: 1200px;
    margin: 0 auto;
}

@media screen and (max-width: 742px) {
    section {
        display: block;
    }
}

.col1,
.col2 {
    flex-grow: 1;
    flex-basis: 0;
    padding: 1rem;
}

[v-cloak] {
    display: none;
}

.error-msg {
    margin-top: 2rem;
    text-align: left;
    font-size: 15px;
    padding-left: 68px;
}

.error-msg p {
    color: #d32f2f;
    margin: 0;
}

.button {
    background: #5071b6;
    border: 0;
    outline: 0;
    color: #fff;
    padding: 0.8rem 1rem;
    min-width: 150px;
    font-size: 16px;
    border-radius: 3px;
    cursor: pointer;
}

.button:hover {
    background: #6280be;
}

.button:disabled {
    opacity: 0.5;
}

.button:disabled:hover {
    background: #5071b6;
}

.text-center {
    text-align: center;
}

.inline {
    margin: 0;
    padding: 0;
    list-style: none;
}

.inline li {
    display: inline-block;
}

.clear {
    clear: both;
}

form label {
    display: block;
    font-size: 16px;
    margin-bottom: 0.5rem;
}

form input {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
    font-size: 16px;
    padding: 10px;
    outline: 0;
    border: 1px solid #e6ecf0;
    border-radius: 3px;
}

form input:focus {
    box-shadow: 0 0 5px 0 rgba(52, 73, 94, 0.2);
}

form textarea {
    resize: none;
    border: 1px solid #e6ecf0;
    outline: 0;
    height: 100px;
    width: 100%;
    padding: 10px;
    font-size: 16px;
}

.fade-enter-active {
    transition: opacity 0.5s;
}

.fade-leave-active {
    transition: opacity 0s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

#login {
    background: linear-gradient(to right,
            #5071b6 0%,
            #5071b6 50%,
            #fff 50%,
            #fff 100%);
}

@media screen and (max-width: 742px) {
    #login {
        height: 100vh;
        background: #fff;
    }
}

#login .col1,
#login .col2 {
    height: 100vh;
    padding-top: 30vh;
}

@media screen and (max-width: 742px) {

    #login .col1,
    #login .col2 {
        height: auto;
        padding-top: 20vh;
    }
}

#login .col1 {
    color: #fff;
}

@media screen and (max-width: 742px) {
    #login .col1 {
        display: none;
    }
}

#login .col1 p {
    max-width: 490px;
    margin-top: 2rem;
    line-height: 1.8;
}

#login .col1 a {
    color: #fff;
    text-decoration: underline;
}

#login .signup-form {
    padding-top: 20vh;
}

@media screen and (max-width: 742px) {
    #login .signup-form {
        padding-top: 10vh;
    }
}

#login .col2 h1 {
    margin-bottom: 2rem;
}

#login .col2 form {
    max-width: 450px;
    margin: 0 auto;
}

#login .col2 .extras {
    float: right;
    text-align: right;
}

#login .col2 .extras a {
    display: block;
    margin-bottom: 0.5rem;
}

#login .col2 .password-reset h1 {
    margin-bottom: 1rem;
}

#login .col2 .password-reset p {
    margin-bottom: 2rem;
}

.mainteneo-tagline {
    background-repeat: no-repeat;
    box-sizing: border-box;
    color: rgb(255, 255, 255);
    font-family: "Roboto", sans-serif;
    font-size: 20px;
    font-weight: 300;
    line-height: 32px;
    text-align: right;
    text-rendering: optimizelegibility;
    transition-delay: 0s;
    transition-duration: 0.15s;
    transition-property: all;
    transition-timing-function: ease;
    -moz-osx-font-smoothing: grayscale;
}
</style>
