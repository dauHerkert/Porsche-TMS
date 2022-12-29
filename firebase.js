import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, updateEmail, updatePassword } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, addDoc, setDoc, updateDoc, getDoc, doc } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js';
import { getStorage, ref, uploadBytes } from 'https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js';

const firebaseConfig = {
  apiKey: "AIzaSyDuWqqoSEfawmsdJNQzIDKk6lfvEKAubmA",
  authDomain: "porsche-tms.firebaseapp.com",
  projectId: "porsche-tms",
  storageBucket: "porsche-tms.appspot.com",
  messagingSenderId: "267742806983",
  appId: "1:267742806983:web:7e8a7ed147f052676b8fe2"
};
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    const storage = getStorage(app);

     if (window.location.pathname == "/"){
   //identify auth action forms
    let signUpForm = document.getElementById('wf-form-signup-form');
    let signInForm = document.getElementById('wf-form-signin-form');
    let signOutButton = document.getElementById('signout-button');
    //assign event listeners
    if(typeof(signUpForm) !== null) {
      signUpForm.addEventListener('submit', handleSignUp, true)
      } else {};
     if(typeof(signInForm) !== null) {
      signInForm.addEventListener('submit', handleSignIn, true)
      } else {};
      if(typeof signOutButton !== null) {
        signOutButton.addEventListener('click', handleSignOut);
           } else {}
    //handle signUp
    function handleSignUp(e) {
        e.preventDefault();
        e.stopPropagation();
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;
      console.log("email is " + email);
      console.log("password is " + password + ". Now sending to firebase.");
      createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      //Signed in
      const user = userCredential.user;
      alert('user successfully created: ' + user.email);
      window.location = "/sign-in"
    })
    .catch((error) => {
      const errorMessage = error.message;
      var errorText = document.getElementById('signup-error-message');
      console.log(errorMessage);
      errorText.innerHTML = errorMessage;
    });
  };
      //handle signIn
    function handleSignIn(e) {
        e.preventDefault();
        e.stopPropagation();
      const email = document.getElementById('signin-email').value;
      const password = document.getElementById('signin-password').value;
      signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      // Signed in
      const user = userCredential.user;
      alert('user logged in: ' + user.email);
       window.location = "/sign-in"
    })
    .catch((error) => {
      const errorMessage = error.message;
      var errorText = document.getElementById('signin-error-message');
      console.log(errorMessage);
      errorText.innerHTML = errorMessage;
    });
    }
    }
    function handleSignOut() {
        signOut(auth).then(() => {
        alert('user signed out')
        window.location = "/"
    }).catch((error) => {
    const errorMessage = error.message;
    console.log(errorMessage);
    });
    }
     onAuthStateChanged(auth, (user) => {
      let publicElements = document.querySelectorAll("[data-onlogin='hide']");
      let privateElements = document.querySelectorAll("[data-onlogin='show']");

      if (user) {
      console.log(user);
      let update_username_modal = document.getElementById("username_form_modal");
      let update_email_modal = document.getElementById("email_form_modal");
      let update_password_modal = document.getElementById("password_form_modal");
      let change_email = document.getElementById("change_email");
      let change_username = document.getElementById("change_username");
      let change_password = document.getElementById("change_password");
      const email = user.email;
      const displayName = user.displayName;
      const uid = user.uid;

      if (window.location.pathname == "/sign-in"){
        document.getElementById("user_email").innerHTML = `<span><b>Email:</b> ${email}</span>`;
        if (displayName == null){
          document.getElementById("username_display").innerHTML = `<span><b>Username:</b> Add your username</span>`;
        }else{
          document.getElementById("username_display").innerHTML = `<span><b>Username:</b> ${displayName}</span>`;
        }
        document.getElementById("user_password").innerHTML = `<span><b>Change Password</b></span>`;
        document.getElementById("account_type_info").innerHTML = ``
      }
      if(update_username_modal !== null){
        update_username_modal.addEventListener('submit', updateUsername, true);
      }
      if(update_email_modal !== null){
        update_email_modal.addEventListener('submit', updateUserEmail, true);
      }
      if(update_password_modal !== null){
        update_password_modal.addEventListener('submit', updateUserPassword, true);
      }
      //Update username
      function updateUsername(e){
        e.preventDefault();
        e.stopPropagation();
        updateProfile(auth.currentUser, {
        displayName: change_username.value
      }).then(() => {
        window.location.reload();
        console.log("Updated");
      }).catch((error) => {
       console.log("Error happened");
      });
      }
      // Update email
      function updateUserEmail(e){
        e.preventDefault();
        e.stopPropagation();
        updateEmail(auth.currentUser, change_email.value).then(() => {
          console.log("Email updated!")
          window.location.reload();
        }).catch((error) => {
        });
      }
      // update password
      function updateUserPassword(e){
         e.preventDefault();
         e.stopPropagation();
        const newPassword = change_password.value;
        updatePassword(user, newPassword).then(() => {
          alert("Password changed!")
          window.location.reload();
          console.log("Updated")
        }).catch((error) => {
          console.log("An error has ocurred")
          // ...
        });
      }
      //Depending on account type the page realoads
      if (window.location.pathname == "/press"){
      function getUserName(){
        const typeRef = doc(db, 'users', uid);

    document.getElementById("client_press").innerHTML = `Hello Press ${user.displayName}`
        }
        getUserName()
      }
      if (window.location.pathname == "/supplier"){
      function getUserName(){
        const typeRef = doc(db, 'users', uid);
    document.getElementById("supplier_user").innerHTML = `Hello Supplier ${user.displayName}`
        }
        getUserName()
      }
  // Add press info
       if(window.location.pathname == "/press"){
         const press_form = document.getElementById('moreInfo_press_form');
         const workspot = document.getElementById('workspot');
         const publisher = document.getElementById('publisher');
         const media_type = document.getElementById('media_type');
         const from_press_date = document.getElementById('from_press_date');
         const to_press_date = document.getElementById('to_press_date');
         const special_press_request = document.getElementById('special_press_request');

         press_form.addEventListener('submit', addSupplierInfo)
        function addSupplierInfo(e){
         e.preventDefault();
         e.stopPropagation();
         const userRef = doc(db, 'users', uid);
         setDoc(userRef, { From: from_press_date.value, To: to_press_date.value, Special_request: special_press_request.value, Workspot: workspot.value, Publisher: publisher.value, Media_type: media_type.value, press_id: press_id.value}, { merge: true });

         setTimeout(function(){
          window.pathname = '/sign-in';
      }, 5000);
       }
         // Upload images
         const press_id = document.getElementById('fileInp');
         const fileText = document.getElementById('fileText');
         const uploadFile = document.getElementById('uploadFile');
         var fileItem;
         var fileName;

         press_id.addEventListener('change', getFile);
         uploadFile.addEventListener('click', uploadImage);

         function getFile(e){
         fileItem = e.target.files[0];
         fileName = e.target.files[0].name;
         console.log(fileName);
       }

       function uploadImage(){
         const storageRef = ref(storage, 'press_id/'+fileName);

         uploadBytes(storageRef, fileItem).then((snapshot) => {
           console.log('Uploaded a blob or file!');
           window.location = '/sign-in'
         });
       }
      }
     // Add suppliers info
     if(window.location.pathname == "/supplier"){

       const supplier_form = document.getElementById('supplier_form');
       const from_date = document.getElementById('from_date');
       const to_date = document.getElementById('to_date');
       const special_request = document.getElementById('special_request');
       const access_zone = document.getElementById('zones');

       supplier_form.addEventListener('submit', addSupplierInfo)

      function addSupplierInfo(e){
       e.preventDefault();
       e.stopPropagation();

       const userRef = doc(db, 'users', uid);
       setDoc(userRef, { From: from_date.value, To: to_date.value, Special_request: special_request.value, access_zone: access_zone.value}, { merge: true });

        setTimeout(function(){
          window.location = '/sign-in';
      }, 5000);
     }
   }
   if(window.location.pathname == "/sign-in"){
      const from_supplier_form = document.getElementById('from_supplier_form');
      const from_supDate = document.getElementById('from_supplier');
      from_supplier_form.addEventListener('submit', UpdateSupplierFrom)

     function UpdateSupplierFrom(e){
      e.preventDefault();
      e.stopPropagation();

      const userRef = doc(db, 'users', uid);
      setDoc(userRef, { From: from_supDate.value}, { merge: true });

       setTimeout(function(){
         window.location.reload();
     }, 2000);
    }
    const to_supplier_form = document.getElementById('to_supplier_form');
      const to_supDate = document.getElementById('to_supplier');
      to_supplier_form.addEventListener('submit', UpdateSupplierTo)

     function UpdateSupplierTo(e){
      e.preventDefault();
      e.stopPropagation();
      const userRef = doc(db, 'users', uid);
      setDoc(userRef, { To: to_supDate.value}, { merge: true });
       setTimeout(function(){
         window.location.reload();
     }, 2000);
    }
      const require_form_supplier = document.getElementById('require_form_supplier');
      const change_require_supplier = document.getElementById('change_require_supplier');
      require_form_supplier.addEventListener('submit', UpdateSupplierRequire)

     function UpdateSupplierRequire(e){
      e.preventDefault();
      e.stopPropagation();
      const userRef = doc(db, 'users', uid);
      setDoc(userRef, { Special_request: change_require_supplier.value}, { merge: true });
       setTimeout(function(){
         window.location.reload();
     }, 2000);
    }
      const zone_form = document.getElementById('zone_form');
      const change_zone = document.getElementById('change_zone');
      zone_form.addEventListener('submit', UpdateSupplierZone)

     function UpdateSupplierZone(e){
      e.preventDefault();
      e.stopPropagation();
      const userRef = doc(db, 'users', uid);
      setDoc(userRef, { access_zone: change_zone.value}, { merge: true });
       setTimeout(function(){
         window.location.reload();
     }, 2000);
    }
    }
      //User Admin
      if(window.location.pathname == "/admin"){

       let update_user_form = document.getElementById('update_user_type');
        let user_specific_id = document.getElementById('id');
        let userTypeUpdate = document.getElementById('accountType');
        let admin_cred = document.getElementById('is_admin');

        update_user_form.addEventListener('submit', (e) =>{
          e.preventDefault();
          e.stopPropagation()

          if(user_specific_id != null || user_specific_id != 0){
          const userRef = doc(db, 'users', update_user_form.id.value);
          setDoc(userRef, { type: userTypeUpdate.value, admin: admin_cred.value }, { merge: true });
          }
        })
       }
        async function getUserInfo(){
         const typeRef = doc(db, 'users', uid);
         const typeSnap = await getDoc(typeRef);
         if (typeSnap.exists()) {
          return typeSnap.data()

         } else {
           console.log("No such document!");
         }
           }
           (async () => {

            let userInfo = await getUserInfo();
            const accountType_button = document.getElementById('account_user_profile');
            const homeButton = document.getElementById('home_button');
            const press_workspot = document.getElementById('press_workspot');
            const publisher = document.getElementById('press_publisher');
            const media = document.getElementById('press_media');
            const press_from = document.getElementById('press_from');
            const press_to = document.getElementById('press_to');
            const press_require = document.getElementById('press_require');
            const supplier_from = document.getElementById('supplier_from');
            const supplier_to = document.getElementById('supplier_to');
            const supplier_request = document.getElementById('supplier_request');
            const supplier_zone = document.getElementById('supplier_zone');
            const press_info = document.getElementsByClassName('press_info');
            const supplier_info = document.getElementsByClassName('supplier_info');

           if (userInfo.type == "Supplier"){
             if (window.location.pathname == '/sign-in'){
                document.getElementById('welcome_user').innerHTML = `Hello Supplier ${user.displayName}`;
                document.getElementById('account_type_info').innerHTML = `<b>Account type:</b> ${userInfo.type}`;
                supplier_from.innerHTML = `<b>From:</b> ${userInfo.From}`;
                supplier_to.innerHTML = `<b>To:</b> ${userInfo.To}`;
                supplier_request.innerHTML = `<b>Request:</b> ${userInfo.Special_request}`;
                supplier_zone.innerHTML = `<b>Zone:</b> ${userInfo.access_zone}`;
                for (var i=0;i<supplier_info.length;i+=1){
                  supplier_info[i].style.display = 'flex';
                }
             }
             accountType_button.setAttribute("href", "/supplier");
             homeButton.setAttribute("href", "/supplier");
           }else if(userInfo.type == "Press"){
             if(window.location.pathname == '/sign-in'){
                 document.getElementById('welcome_user').innerHTML = `Hello Press ${user.displayName}`;
                 document.getElementById('account_type_info').innerHTML = `<b>Account type:</b> ${userInfo.type}`;
                 press_workspot.innerHTML = `<b>Workspot:</b> ${userInfo.Workspot}`;
                 publisher.innerHTML = `<b>Publisher:</b> ${userInfo.Publisher}`;
                 media.innerHTML = `<b>Media:</b> ${userInfo.Media_type}`;
                 press_from.innerHTML = `<b>From:</b> ${userInfo.From}`;
                 press_to.innerHTML = `<b>To:</b> ${userInfo.To}`;
                 press_require.innerHTML = `<b>Request:</b> ${userInfo.Special_request}`;
                 for (var i=0;i<press_info.length;i+=1){
                  press_info[i].style.display = 'flex';
                }
             }
             accountType_button.setAttribute("href", "/press");
             homeButton.setAttribute("href", "/press");
           }else{
             if(window.location.pathname == '/sign-in'){
               document.getElementById('welcome_user').innerHTML = `Hello Admin ${user.displayName}`;
             document.getElementById('account_type_info').innerHTML = '';
             }
             accountType_button.setAttribute("href", "/admin");
             homeButton.setAttribute("href", "/admin");
           }
           if(userInfo.admin == "1"){
            if(window.location.pathname == '/sign-in'){
              document.getElementById('welcome_user').innerHTML = `Hello Admin ${user.displayName}`;
            }
            accountType_button.setAttribute("href", "/admin");
          }
         })();
      // User is signed in
      privateElements.forEach(function(element) {
      element.style.display = "initial";
      });
      publicElements.forEach(function(element) {
      element.style.display = "none";
      });
      console.log(`The current user's UID is equal to ${uid}`);
    } else {
      // User is signed out
      publicElements.forEach(function(element) {
      element.style.display = "initial";
      });
      privateElements.forEach(function(element) {
      element.style.display = "none";
      });
      return
    }
  });
        if (window.location.pathname == "/sign-in"){
        let signOutButton2 = document.getElementById('signout-button2');
        if(typeof signOutButton2 !== null) {
          signOutButton2.addEventListener('click', handleSignOut);
           } else {}
}
$(document).ready(function () {
        $('[data-toggle="datepicker"]').datepicker({
            format: 'mm-dd-yyyy'
        });
        if (window.innerWidth < 768) {
            $('[data-toggle="datepicker"]').attr('readonly', 'readonly')
        }
    });