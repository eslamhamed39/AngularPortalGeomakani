import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }




// function showCaptchaDiv(){
//   let x=0;
//   if(document.getElementById("FullName").value.length === 0){x=1;}
//   if(document.getElementById("MobileNumber").value.length === 0){ x=1;}
//   if(document.getElementById("CityName").value.length === 0){x=1;}
//   if(document.getElementById("eventdate").value.length === 0){x=1;}
//   if(document.getElementById("Region").value.length === 0){x=1;}
//   if(document.getElementById("email").value.length === 0){x=1;}
//   if(x===0){
//     var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//     if (document.getElementById("email").value.match(emailRegex)) {
//       generate();
//       document.getElementById("Captcha").style.display = 'block';
//       document.getElementById("Captchawrapper").style.display = 'flex';
//       document.getElementById("info").style.display = 'none';
//   	  document.getElementById("Headerwrapper").style.display = 'none';
//       document.getElementById("infowrapper").style.display = 'none';
//       document.getElementById("Questionaire").style.display = 'none';
//       document.getElementById("Question").style.display = 'none';
//   	  const privacyFooter = document.getElementById("privacy_footer");
//   	  privacyFooter.style.position = "fixed";
//   	  privacyFooter.style.bottom = "0";
//       IG.getItemById("csubmit").reload()
//     } else {
//       //alert("Invalid email address!");
//       handleFormError("email")
//       document.getElementById("email").focus();
//       document.getElementById("Captcha").style.display = 'none';
//     }
//   }
//   else{
//     //alert("Please fill required columns.");
//     handleFormError("validation") 
//     //sendWarningToast("خطاء","برجاء ملئ جميع الحقول")
//     document.getElementById("Captcha").style.display = 'none';
//       document.getElementById("info").style.display = 'block';
//       document.getElementById("Questionaire").style.display = 'block';
//   }
// }



function showCaptchaDiv(){
  generate();
  document.getElementById("Captcha").style.display = 'block';
  document.getElementById("Captchawrapper").style.display = 'flex';
  document.getElementById("info").style.display = 'none';
  document.getElementById("Headerwrapper").style.display = 'none';
  document.getElementById("infowrapper").style.display = 'none';
  document.getElementById("Questionaire").style.display = 'none';
  document.getElementById("Question").style.display = 'none';
  const privacyFooter = document.getElementById("privacy_footer");
  privacyFooter.style.position = "fixed";
  privacyFooter.style.bottom = "0";
  IG.getItemById("csubmit").reload()
}