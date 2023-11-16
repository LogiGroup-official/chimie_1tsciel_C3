<!--*********************************************************************-->
<!--******************* routines de gestion des QCM *********************-->
<!--******************** version 1.0 octobre 2003 ***********************-->
<!--******************** revu en 2023 ***********************************-->
<!--*********************************************************************-->



<!-- gestion fenetres de messages -->

<!--*********************************************************************-->
<!--******************* fermeture fen_courante, ouverture "nom" *********-->
<!--*********************************************************************-->
function ouverture_autre_fenetre(nom)
{
	self.close();
	fen = window.open(nom);
	
}

<!--*********************************************************************-->
<!--******************* ajout bouton fermeture fen_courante *************-->
<!--*********************************************************************-->
function bouton_fermeture()
{
	document.write('<HR class=barre>');
	document.write('<center><form name=fermer>');
	document.write('<input type=button value=Fermer ');
	document.write('onclick=self.close()>');
	document.write('</form></center>');
}

<!--*********************************************************************-->
<!--******************* ouverture fenetre "nom au "format" **************-->
<!--****** exemple de format :                                      *****-->
<!--****** format ="resizable=,scrollbars=,toolbar=,left=,          *****-->
<!--******                           top=,height=,width="           *****-->
<!--*********************************************************************-->
function afficher_message(nom, format)
{
	fen = document.open(nom,"message",format);
	fen.document.close();
}

<!--*********************************************************************-->
<!--******************* ouverture fenetre "nom"            **************-->
<!--****** avec le format :                                         *****-->
<!--****** "resizable=no,scrollbars=yes,toolbar=no,left=200,        *****-->
<!--******                           top=200,height=200,width=500"  *****-->
<!--*********************************************************************-->
function afficher_message(nom)
{
	fen = document.open(nom,"message","resizable=no,scrollbars=yes,toolbar=no,left=200,top=200,height=200,width=500");
	fen.document.close();
}	

<!--*********************************************************************-->
<!--******************* gestion des liens en frame            ***********-->
<!--****** repere = repere pour retour à l'index              ***********-->
<!--****** prec=page précédente, suiv= page suivante,         ***********-->
<!--*********************************************************************-->

function lien(repere, prec, suiv)
{
 //if(top!=this)
 {
  top.repere_page = repere;
  if (prec == '') top.prec = "../index.htm"+top.repere_page;
  else top.prec = prec;
  if (suiv == '') top.suiv = "../index.htm"+top.repere_page;
  else top.suiv = suiv;
  top.valide_bord = true;
 }
}

<!--*********************************************************************-->
<!--******************* gestion des retours en fin de page    ***********-->
<!--*********************************************************************-->
function retour() {
	//retour à la page précédente
	with (document) {
		open();
		write('<P align="center">');
		
		write('<FONT size="3" face="Times New Roman">');
		write('<A style="margin: 80px;" href="' + top.prec + '">page pr&eacute;c&eacute;dente</A>');

	//retour à la page d'accueil
		write('<A style="margin: 80px;" href="../index.htm' + top.repere_page + '">page d&rsquo;accueil</A>');
		
	//retour à la page suivante
		write('<A style="margin: 80px;" href="' + top.suiv + '">page suivante</A>');
		write('</font>');
		close();
	}
}
<!--*********************************************************************-->
<!--******************* fonction de mise à jour du vu_metre *************-->
<!--*********************************************************************-->

function vu_metre()
{
	var element = document.getElementById("maBarre");   
	var width = 1;
	n = top.nbrechamps;
	total = 0;
	if(typeof(n)=="undefined") {
		total = 0;
		element.style.width = total + '%'; 
		return (false);
	}
	
	for (i=0; i<n; i++)	{
		total += top.boolpage[i];
	}
	total = (total*100)/n;
	if (total > 100) total = 100;
	
    element.style.width = total + '%'; 
	element.innerHTML = Math.round(total*2)/10;
	return(true);
}

<!-- routines pour réponse numérique -->
<!--*********************************************************************-->
<!--******************* Reponses numeriques avec unités *****************-->
<!--*********************************************************************-->

//********* arrondi à sign nombres significatifs
function round1(nbr, sign)
{
  var bool = new Boolean(false);
  var Snbre = new String(nbr);
  var Smant = new String(Snbre.match(/^[+-]?\d*\.?\d*/));
  if (Smant.match(/^\.?/)==".") Smant = "0" + Smant;
  
  var temp = new String(Smant.match(/^[+-]?[0]*\.?[0]*/));

  Smant = Smant.replace(/^[+-]?0*\.?0*/,"");

  if (Smant.length+1<=sign) return (nbr);

  for (i=1; i<=sign; i++)
  {
    if (i==(sign))
    {
      var dernier = new Number(Smant.match(/^\d?/));
      Smant = Smant.replace(/^\d?/,""); 
      if(Smant.match(/^\.?/)==".")
      { 
        Smant = Smant.replace(/^\.?/,""); 
        bool=true;
      }
      var arrondi = new Number(Smant.match(/^\d?/));
      if(arrondi>=5) temp += String(dernier+1);
      else temp += String(dernier);
      
      if(bool==true) temp += ".";
    }
    else
    {
      temp += Smant.match(/^\d?/);
      Smant = Smant.replace(/^\d?/,""); 
    }
    if(Smant.match(/^\.?/)==".")
      { 
        temp += Smant.match(/^\.?/);
        Smant = Smant.replace(/^\.?/,""); 
      }
  }
  while(Smant.length>0)
  { 
    temp += "0";
    Smant = Smant.replace(/^\d?/,"");
    if(Smant.match(/^\.?/)==".")
      { 
        temp += Smant.match(/^\.?/);
        Smant = Smant.replace(/^\.?/,""); 
      }
  }

  Snbre = Snbre.replace(/^[+-]?\d*\.?\d*/,temp);
  return(parseFloat(Snbre));
}

//************ converti la valeur en tenant compte de l'ordre de grandeur
//************ accepte une chaine de caractères (ex: 25ms)
//************ renvoie un nombre et son unité (ex: 0.025 s)
function conv (val)
{
  var rep=new String;
  var nbr=new Number(0);
  var ordre=new String;

//suppression espaces
  rep = val;
  while (Boolean(rep.match(/\s/))) rep=rep.replace(/\s/,"");
  while (rep.match(/,/)!=null) rep=rep.replace(/,/,".");
  


//extraction nombre
  var nombre = new String(rep.match(/^[+-]?\d*[.]?\d*/));
  rep = rep.replace(/^[+-]?\d*[.]?\d*/,"");
  if (rep.match(/^[eE][+-]?\d+/)!=null)
  {
    nombre += rep.match(/^[eE][+-]?\d+[.]?\d*/);
    rep = rep.replace(/^[eE][+-]?\d+[.]?\d*/,"");
  }

  facteur = new Number(1);

  if (nombre.match(/[eE][+-]?\d+[.]?\d*$/)!=null) 
  { 
    var puis = new String(nombre.match(/[eE][+-]?\d+[.]?\d*$/));
    puis = puis.replace(/[eE]/,"");
    nombre = nombre.replace(/[eE][+-]?\d+[.]?\d*$/,"")
    facteur = Math.pow(10,parseFloat(puis));
  }

//extraction ordre de grandeur
  ordre = rep.match(/^[Mkmunp]?/);
  rep = rep.replace(/^[Mkmunp]?/,"");

   if (ordre == "M") nbr = parseFloat(nombre)*facteur*1000000;
   if (ordre == "k") nbr = parseFloat(nombre)*facteur*1000;
   if (ordre == "") nbr = parseFloat(nombre)*facteur;
   if (ordre == "m") nbr = parseFloat(nombre)*facteur*0.001;
   if (ordre == "u") nbr = parseFloat(nombre)*facteur*0.000001;
   if (ordre == "n") nbr = parseFloat(nombre)*facteur*0.000000001;
   if (ordre == "p") nbr = parseFloat(nombre)*facteur*0.000000000001;
   //return([nbr,rep.toLowerCase()]);

   return([nbr,rep]);
}

//************************************************************************
//************* test valeur numérique et unité
//************* recoit form == nom du formulaire, 
//*************        reponse == variable globale tableau reponse   
//*************        num == numéro réponse dans tableau reponse globale
//************* renvoit 1 si correct, 0 sinon
function champtestnum(form, reponse, num) 
{ 
  var val = form.value; 		//valeur réponse


  var bool = true;			//booléen test de réponse
  var repchamps = new Array(2);
  var repjuste = new Array(2);


  repchamps=conv(val);
  repjuste=conv(reponse[num]);
  //test réponse
  bool = bool&&(Boolean)(repchamps[0]==repjuste[0]);
  bool = bool&&(Boolean)(repchamps[1]==repjuste[1]);

  if (val.length == 0) 
  { 
    alert("Il n'y a pas de réponse !"); 
    return(0);
  }
  else if (!bool)
  {
    alert("reponse fausse !");
    return(0);
  } 
  else
  {
    alert("reponse correcte !");
    return(1); 
  }
  
} 
//************************************************************************
//************* test valeur numérique et unité
//************* recoit form == nom du formulaire, 
//*************        reponse == variable globale reponse  
//*************		   bouton == nom bouton du formulaire 
//************* renvoit 1 si correct, 0 sinon
function champtestnum2(form, reponse, bouton) 
{ 
  var val = form.value; 		//valeur réponse


  var bool = true;			//booléen test de réponse
  var repchamps = new Array(2);
  var repjuste = new Array(2);


  repchamps=conv(val);
  repjuste=conv(reponse);
  //test réponse
  bool = bool&&(Boolean)(repchamps[0]==repjuste[0]);
  bool = bool&&(Boolean)(repchamps[1]==repjuste[1]);

  if (val.length == 0) 
  { 
    alert("Il n'y a pas de réponse !");
    bouton.value="Valider"; 
    return(0);
  }
  else if (!bool)
  {
    if (repchamps[0]==repjuste[0]) 
	{ alert("reponse fausse !\n\n      (unité ?)");
	  bouton.value="  faux   ";
	  return(0);
 	}
 
    if ( Math.abs((repchamps[0]-repjuste[0])/repjuste[0])<0.1 )	
		alert("reponse fausse !\n\n      (arrondi ?)");
    else alert("reponse fausse !");
    bouton.value="  faux   ";
    return(0);
  } 
  else
  {
    alert("reponse correcte !");
    bouton.value="  juste  ";
    return(1); 
  }
  
} 
//************************************************************************
//************* test valeur numérique et unité
//************* recoit form == nom du formulaire, 
//*************        reponse == variable globale reponse
//*************        bouton == nom bouton formulaire  
//*************        mes == url message si erreur
//*************		   compteur == objet de comptage avant d'envoyer le message

//************* renvoit 1 si correct, 0 sinon
function champtestnum2_mes(form, reponse, bouton, mes, compteur) 
{ 
  var val = form.value; 		//valeur réponse


  var bool = true;			//booléen test de réponse
  var repchamps = new Array(2);
  var repjuste = new Array(2);

  repchamps=conv(val);
  repjuste=conv(reponse);
  //test réponse
  bool = bool&&(Boolean)(repchamps[0]==repjuste[0]);
  bool = bool&&(Boolean)(repchamps[1]==repjuste[1]);

  if (val.length == 0) 
  { 
    alert("Il n'y a pas de réponse !"); 
    bouton.value="Valider";
    return(0);
  }
  else if (!bool)
  {
    if (repchamps[0]==repjuste[0]) 
	{ alert("reponse fausse !\n\n      (unité ?)");
	  bouton.value="  faux   ";
	  return(0);
 	}
 
    if ( Math.abs((repchamps[0]-repjuste[0])/repjuste[0])<0.1 )	
		alert("reponse fausse !\n\n      (arrondi ?)");
    else 
    if ((compteur.iter > 0)||(mes == ''))
   	    { 
	      alert("Mauvaise r\351ponse !\n\n  Essayez encore");
	      compteur.iter--;
	      bouton.value="  faux   ";
    	  return(0);
	   } 
	   else 
	   {
	       afficher_message(mes);
	       compteur.iter = 0;
	       bouton.value="  faux   ";
	       return(0);
       }
  } 
  else
  {
    alert("reponse correcte !");
    bouton.value="  juste  ";
    return(1); 
  }
  
} 
//************************************************************************
//************* test valeur numérique et unité
//************* recoit form == nom du formulaire,
//*************        reponse == variable globale reponse
//*************        bouton == nom bouton formulaire
//*************        mes == url message si juste
//************* renvoit 1 si correct, 0 sinon
function champtestnum2_mes_juste(form, reponse, bouton, mes)
{
  var val = form.value; 		//valeur réponse


  var bool = true;			//booléen test de réponse
  var repchamps = new Array(2);
  var repjuste = new Array(2);

  repchamps=conv(val);
  repjuste=conv(reponse);
  //test réponse
  bool = bool&&(Boolean)(repchamps[0]==repjuste[0]);
  bool = bool&&(Boolean)(repchamps[1]==repjuste[1]);

  if (val.length == 0)
  {
    alert("Il n'y a pas de réponse !");
    bouton.value="Valider";
    return(0);
  }
  else if (!bool)
  {
    if (repchamps[0]==repjuste[0])
	{ alert("reponse fausse !\n\n      (unité ?)");
	  bouton.value="  faux   ";
	  return(0);
 	}

    if ( Math.abs((repchamps[0]-repjuste[0])/repjuste[0])<0.1 )	
		alert("reponse fausse !\n\n      (arrondi ?)");
    else
       {
	       alert("Mauvaise r\351ponse !");
	       bouton.value="  faux   ";
	       return(0);
       }
  }
  else
  {
    afficher_message(mes);
    bouton.value="  juste  ";
    return(1);
  }

}
//*********************************************************************S
//******************* image bilan *************************************
//*********************************************************************
//******************* recoit boolpage == tableau entiers resultats page
//*******************        chemin == chemin acces animation
//*******************        rapport == rapport de détermination des bornes inf et sup de decision
function afficher(boolpage,chemin,rapport)
{
  var bool = new Number(0);
  
  //nbrechamps = boolpage.length donc l'un peut remplacer l'autre
  
  if (rapport>nbrechamps) rapport = nbrechamps;
  var interval = new Number(nbrechamps/rapport);
  for (i=0; i<boolpage.length; i++) bool += boolpage[i];
  if (bool>(nbrechamps-interval))
  document.images.icone.src=chemin+"feuvert.gif";
  else if (bool<=interval)
  document.images.icone.src=chemin+"feurouge.gif";
  else 
  document.images.icone.src=chemin+"feuorange.gif";
}
//*********************************************************************
//******************* Boutons à cocher 
//******************* recoit form == nom du formulaire
//*******************        reponse == var. globale tableau reponse
//*******************        bouton == nom formulaire bouton reponse
//******************* renvoit 1 si correct, 0 sinon
function champtestqcm(form,reponse,bouton) 
  { 
//booléen de test réponses
        var booleen=true;				
      

        for (i=0; i<form.length; i++) 
        
                    booleen = booleen &&((form[i].checked)==reponse[i]);
              
	if ( booleen )
        { 
	  alert("OK ! Bonne r\351ponse !");
	  bouton.value="  juste  ";
	  return(1);
	} 
	else 
	{ 
	  alert("Mauvaise r\351ponse !");
	  bouton.value="  faux   "; 
	  return(0);
	} 
  } 
//*********************************************************************
//******************* Boutons à cocher 
//******************* recoit form == nom du formulaire
//*******************        reponse == var. globale tableau reponse
//*******************        bouton == nom formulaire bouton reponse
//*******************        mes == url message si erreur
//*******************	   	 compteur == objet de comptage avant d'envoyer le message
//******************* renvoit 1 si correct, 0 sinon
function champtestqcm_mes(form,reponse,bouton,mes,compteur) 
  { 
//booléen de test réponses
        var booleen=true;
        	

        for (i=0; i<form.length; i++) 
                      booleen = booleen &&((form[i].checked)==reponse[i]);
		           
	if ( booleen )
        { 
	  alert("OK ! Bonne r\351ponse !");
	  bouton.value="  juste  ";
	  return(1);
	} 
	else 
	{
		
	   if ((mes == '')||(compteur.iter > 0))
   	    { 
	      alert("Mauvaise r\351ponse !\n\n  Essayez encore.");
    	  bouton.value="  faux   "; 
    	  compteur.iter--;
    	  return(0);
	   } 
	   else 
	   {
	       afficher_message(mes);
	       bouton.value="  faux   "; 
    	   return(0);
       }
    }   
  } 
//*********************************************************************
//******************* Boutons à cocher
//******************* recoit form == nom du formulaire
//*******************        reponse == var. globale tableau reponse
//*******************        bouton == nom formulaire bouton reponse
//*******************        mes == url message si juste
//******************* renvoit 1 si correct, 0 sinon
function champtestqcm_mes_juste(form,reponse,bouton,mes)
  {
//booléen de test réponses
        var booleen=true;
        	

        for (i=0; i<form.length; i++)
                      booleen = booleen &&((form[i].checked)==reponse[i]);
		
	if ( booleen )
        {
	  afficher_message(mes);//alert("OK ! Bonne réponse !");
	  bouton.value="  juste  ";
	  return(1);
	}
	else
	   {
	       alert("Mauvaise r\351ponse !");
	       bouton.value="  faux   ";
    	   return(0);
       }
  }
//*********************************************************************
//****************** boite à choix multiple + calcul note *************
//****************** recoit form == formulaire des boites à option
//******************        reponse == variable globale tableau réponse
//******************        formbutton == formulaire bouton réponse
//******************* renvoit 1 si correct, 0 sinon
function champtestoption(form, reponse, formbutton) 
{
   var note=0;

   for (i=0; i<form.length; i++) 
               if (form[i].selectedIndex==reponse[i]) { note+=1; }
   formbutton.value="Note = "+note+"/"+form.length;
   if (note==form.length) return(1);
   else return(0);
}
//*********************************************************************
//****************** boite à choix multiple + calcul note *************
//****************** recoit form == formulaire des boites à option
//******************        reponse == variable globale tableau réponse
//******************        formbutton == formulaire bouton réponse
//******************        mes == url message si erreur
//******************		compteur == objet de comptage avant d'envoyer le message
//******************* renvoit 1 si correct, 0 sinon
function champtestoption_mes(form, reponse, formbutton, mes, compteur) 
{
   var note=0;

   for (i=0; i<form.length; i++) 
               if (form[i].selectedIndex==reponse[i]) { note+=1; }
   formbutton.value="Note = "+note+"/"+form.length;
   if (note==form.length) return(1);
   else 
	   if ((compteur.iter > 0) || (mes == ''))
	   {
	   		alert("Mauvaise r\351ponse !\n\n  Essayez encore.");
	    	compteur.iter--;
	    	return(0);
	   }
	   else
	   {
	        afficher_message(mes);
	        return(0);
	   }     
}
//*********************************************************************
//****************** boite à choix multiple + calcul note *************
//****************** recoit form == nom du formulaire
//******************        reponse == variable globale tableau réponse
//******************* renvoit 1 si correct, 0 sinon
function champtesttext(form, reponse) 
{ 
  var val = form.value;

  var rep=new String(val.toLowerCase());
  var bool = Boolean(false);
//suppression espaces
  while (Boolean(rep.match(/\s/))) rep=rep.replace(/\s/,"");

  if (val.length == 0) 
  { 
    alert("Il n'y a pas de réponse !"); 
    return false;
  }
  for(i=0; i<reponse.length; i++) bool = (bool || (reponse[i]==rep));
                        
  if (!bool)
  {
    alert("reponse fausse !");
    return(0);
  } 
  else
  {
    alert("reponse correcte !");
    return(1); 
  }
} 
//*********************************************************************
//****************** boite à choix multiple + calcul note *************
//****************** recoit form == nom du formulaire
//******************        reponse == variable globale tableau réponse
//******************* renvoit 1 si correct, 0 sinon
function champtesttext2(form, reponse, bouton) 
{ 
  var val = form.value;

  var rep=new String(val.toLowerCase());
  var bool = Boolean(false);
//suppression espaces
  while (Boolean(rep.match(/\s/))) rep=rep.replace(/\s/,"");

  if (val.length == 0) 
  { 
    alert("Il n'y a pas de réponse !"); 
    bouton.value="Valider";
    return false;
  }
  for(i=0; i<reponse.length; i++) bool = (bool || (reponse[i]==rep));
                        
  if (!bool)
  {
    alert("reponse fausse !");
    bouton.value="  faux  ";
    return(0);
  } 
  else
  {
    alert("reponse correcte !");
    bouton.value=" juste ";
    return(1); 
  }
} 
//*********************************************************************
//****************** boite à choix multiple + calcul note *************
//****************** recoit form == nom du formulaire
//******************        reponse == variable globale tableau réponse
//******************        mes == url message si erreur
//******************		compteur == objet de comptage avant d'envoyer le message
//******************* renvoit 1 si correct, 0 sinon
function champtesttext_mes(form, reponse, bouton, mes, compteur) 
{ 
  var val = form.value;

  var rep=new String(val.toLowerCase());
  var bool = Boolean(false);
//suppression espaces
  while (Boolean(rep.match(/\s/))) rep=rep.replace(/\s/,"");

  if (val.length == 0) 
  { 
    alert("Il n'y a pas de réponse !"); 
    bouton.value="Valider";
    return false;
  }
  for(i=0; i<reponse.length; i++) bool = (bool || (reponse[i]==rep));
                        
  if (!bool)
  {
    if (compteur.iter > 0)
    {
    	alert("reponse fausse !");
    	compteur.iter--;
    	bouton.value="  faux  ";
    	return(0);
    }
    else
    {
    	afficher_message(mes);
    	bouton.value="  faux";
    	return(0);
    }
  } 
  else
  {
    alert("reponse correcte !");
    bouton.value=" juste ";
    return(1); 
  }
} 
//*************************************************************************
//******** bouton de test QCM numéro num **********************************
//*************************************************************************
function champtestqcmbouton(num) 
{
  if (num < 0) num = 0; 
  document.write('<form name=bouton'+num+'>');
  document.write('<input type=button value=Valider ');
  document.write('onclick=boolpage['+num+']=champtestqcm(qcm'+num+',reponseQCM'+num+',bouton'+num+'[0]);vu_metre();>');
  document.write('</form>');
}
//*************************************************************************
//******** bouton de test option numéro num *******************************
//*************************************************************************
function champtestoptionbouton(num) 
{
  if (num < 0) num = 0; 
  document.write('<form name=Corrige'+num+'>');
  document.write('<input type=button value=Resultat ');
  document.write('onclick=boolpage['+num+']=champtestoption(option'+num+',reponseoption'+num+',Corrige'+num+'[0]);vu_metre();>');
  document.write('</form>');
}
//*************************************************************************
//******** bouton de test option numéro num *******************************
//*******************        mes == url message si erreur
//*******************		 nbre_test == nombre de test avant affichage message
//*************************************************************************
function champtestoptionbouton_mes(num, mes, nbre_test) 
{
  if (num < 0) num = 0; 
  document.write('<SCR'+'IPT>');
  document.write('var compteur'+num+' = new Object;');
  document.write('compteur'+num+'.iter = '+nbre_test+';');
  document.write('</SCR'+'IPT>');
  document.write('<form name=Corrige'+num+'>');
  document.write('<input type=button value=Resultat ');
  document.write('onclick=boolpage['+num+']=champtestoption_mes(option'+num+',reponseoption'+num+',Corrige'+num+'[0],"'+mes+'",compteur'+num+');vu_metre();>');
  document.write('</form>');
}
//*************************************************************************
//******** bouton de test numérique numéro num ****************************
//*************************************************************************
function champtestnumero(num) 
{
  if (num < 0) num = 0; 
  document.write('<form name=avis'+num+' ');
  document.write('OnSubmit=boolpage['+num+']=champtestnum(avis'+num+'[0],reponsenum,'+num+');vu_metre();return(false);>');
  document.write('<input TYPE=text Value="" SIZE=15 MAXLENGTH=15 >');
  document.write('</form>');
}
//*************************************************************************
//******** bouton de test texte numéro num ****************************
//*************************************************************************
function champtesttextnum(num) 
{
  if (num < 0) num = 0; 
  document.write('<form name=test'+num+' ');
  document.write('OnSubmit=boolpage['+num+']=champtesttext(test'+num+'[0],reponsetext'+num+');vu_metre();return(false);>');
  document.write('<input TYPE=text Value="" SIZE=15 MAXLENGTH=15 >');
  document.write('</form>');
}
//*************************************************************************
//******** formulaire QCM (exposé à l'horizontale) ************************
//******** reçoit num numéro du formulaire
//********        choix tableau de réponses
//*************************************************************************
function qcmh(num, choix)
{
    if (num < 0) num = 0;
    document.write('<center><table BORDER=0 WIDTH=75%>');
    document.write('<caption>');
    document.write('<center><form name=qcm'+num+'></center>');
    document.write('</caption>');
    document.write('<tr>');
    
    for(i=0; i<choix.length; i++)
        document.write('<td><input type=checkbox onclick="if(boolpage['+num+']) this.checked=!this.checked;">'+choix[i]+'</td>');
    
    document.write('<td ALIGN=CENTER>');
    document.write('</form>');
    document.write('<form name=bouton'+num+'>');
    document.write('<input type=button value=Valider onclick=boolpage['+num+']=champtestqcm(qcm'+num+',reponseQCM'+num+',bouton'+num+'[0]);vu_metre();>');
    document.write('</form>');
    document.write('</td>');
    document.write('</tr>');
    document.write('</table></center>');
    //document.write('<hr size="4">');
}
//*************************************************************************
//******** formulaire QCM (exposé à l'horizontale) ************************
//******** reçoit num numéro du formulaire
//********        choix tableau de réponses
//********        mes url message de réponse
//********		  nbre_test == nombre de test avant affichage message
//*************************************************************************
function qcmh_mes(num, choix, mes, nbre_test)
{
    if (num < 0) num = 0;
    document.write('<SCR'+'IPT>');
  	document.write('var compteur'+num+' = new Object;');
  	document.write('compteur'+num+'.iter = '+nbre_test+';');
  	document.write('</SCR'+'IPT>');
    document.write('<center><table BORDER=0 WIDTH=100%>');
    document.write('<caption>');
    document.write('<center><form name=qcm'+num+'></center>');
    document.write('</caption>');
    document.write('<tr>');
    
    for(i=0; i<choix.length; i++)
        document.write('<td><input type=checkbox onclick="if(boolpage['+num+']) this.checked=!this.checked;">'+choix[i]+'</td>');
    
    document.write('<td ALIGN=CENTER>');
    document.write('</form>');
    document.write('<form name=bouton'+num+'>');
    document.write('<input type=button value=Valider onclick=boolpage['+num+']=champtestqcm_mes(qcm'+num+',reponseQCM'+num+',bouton'+num+'[0],"'+mes+'",compteur'+num+');vu_metre();>');
    document.write('</form>');
    document.write('</td>');
    document.write('</tr>');
    document.write('</table></center>');

}
//*************************************************************************
//******** formulaire QCM (exposé à l'horizontale) ************************
//******** reçoit num numéro du formulaire
//********        choix tableau de réponses
//********        mes url message de réponse si reponse juste
//*************************************************************************
function qcmh_mes_juste(num, choix, mes)
{
    if (num < 0) num = 0;
    document.write('<center><table BORDER=0 WIDTH=100%>');
    document.write('<caption>');
    document.write('<center><form name=qcm'+num+'></center>');
    document.write('</caption>');
    document.write('<tr>');

    for(i=0; i<choix.length; i++)
        document.write('<td><input type=checkbox onclick="if(boolpage['+num+']) this.checked=!this.checked;">'+choix[i]+'</td>');

    document.write('<td ALIGN=CENTER>');
    document.write('</form>');
    document.write('<form name=bouton'+num+'>');
    document.write('<input type=button value=Valider onclick=boolpage['+num+']=champtestqcm_mes_juste(qcm'+num+',reponseQCM'+num+',bouton'+num+'[0],"'+mes+'");vu_metre();>');
    document.write('</form>');
    document.write('</td>');
    document.write('</tr>');
    document.write('</table></center>');

}

//*************************************************************************
//******** formulaire QCM (exposé à la verticale) *************************
//******** reçoit num numéro du formulaire
//********        choix tableau de réponses
//*************************************************************************
function qcmv(num, choix)
{
    if (num < 0) num = 0;
    document.write('<center><table BORDER=0 WIDTH=75%>');
    document.write('<caption>');
    document.write('<center><form name=qcm'+num+'><br></center>');
    document.write('</caption>');
    
    
    for(i=0; i<choix.length; i++)
        document.write('<tr><td><input type=checkbox onclick="if(boolpage['+num+']) this.checked=!this.checked;">'+choix[i]+'</td><tr>');
    
    document.write('<td ALIGN=RIGHT>');
    document.write('</form>');
    document.write('<form name=bouton'+num+'>');
    document.write('<input type=button value=Valider onclick=boolpage['+num+']=champtestqcm(qcm'+num+',reponseQCM'+num+',bouton'+num+'[0]);vu_metre();>');
    document.write('</form>');
    document.write('</td>');

    document.write('</table></center>');
    //document.write('<hr size="4">');
}


//*************************************************************************
//******** formulaire QCM (exposé à la verticale) *************************
//******** reçoit num numéro du formulaire
//********        choix tableau de réponses
//********        mes url message de réponse
//******** 		  nbre_test == nombre de test avant affichage message
//*************************************************************************
function qcmv_mes(num, choix, mes, nbre_test)
{
    if (num < 0) num = 0;
    document.write('<SCR'+'IPT>');
  	document.write('var compteur'+num+' = new Object;');
  	document.write('compteur'+num+'.iter = '+nbre_test+';');
  	document.write('</SCR'+'IPT>');
    document.write('<center><table BORDER=0 WIDTH=75%>');
    //document.write('<caption>');
    document.write('<form name=qcm'+num+'><br></center>');
    //document.write('</caption>');

    for(i=0; i<choix.length; i++)
        document.write('<tr><td><input type=checkbox onclick="if(boolpage['+num+']) this.checked=!this.checked;">'+choix[i]+'</td><tr>');

    document.write('<td ALIGN=RIGHT>');
    document.write('</form>');
    document.write('<form name=bouton'+num+'>');
    document.write('<input type=button value=Valider onclick=boolpage['+num+']=champtestqcm_mes(qcm'+num+',reponseQCM'+num+',bouton'+num+'[0],"'+mes+'",compteur'+num+');vu_metre();>');
    document.write('</form>');
    document.write('</td>');

    document.write('</table></center>');

}

//*************************************************************************
//******** formulaire QCM (exposé à la verticale) *************************
//******** reçoit num numéro du formulaire
//********        choix tableau de réponses
//********        mes url message de réponse juste
//*************************************************************************
function qcmv_mes_juste(num, choix, mes)
{
    if (num < 0) num = 0;

    document.write('<center><table BORDER=0 WIDTH=75%>');
    //document.write('<caption>');
    document.write('<form name=qcm'+num+'><br></center>');
    //document.write('</caption>');

    for(i=0; i<choix.length; i++)
        document.write('<tr><td><input type=checkbox onclick="if(boolpage['+num+']) this.checked=!this.checked;">'+choix[i]+'</td><tr>');

    document.write('<td ALIGN=RIGHT>');
    document.write('</form>');
    document.write('<form name=bouton'+num+'>');
    document.write('<input type=button value=Valider onclick=boolpage['+num+']=champtestqcm_mes_juste(qcm'+num+',reponseQCM'+num+',bouton'+num+'[0],"'+mes+'");vu_metre();>');
    document.write('</form>');
    document.write('</td>');

    document.write('</table></center>');

}
//*************************************************************************
//******** formulaire num *************************************************
//******** reçoit num numéro du formulaire
//*************************************************************************
function text(num) 
{
	if (num < 0) num = 0;
    document.write('<center><table BORDER=0 WIDTH=75%>');

    document.write('<form name=avis'+num+' ');
    document.write('OnSubmit=boolpage['+num+']=champtesttext2(avis'+num+'[0],reponsetext'+num+',bouton'+num+'[0]);vu_metre();return(false);>');
  	
    document.write('<tr><td ALIGN=CENTER>');
    
  	document.write('<input TYPE=text Value="" SIZE=15 MAXLENGTH=15 ></td></tr>');
    document.write('</form>');
    document.write('<tr><td align=right><form name=bouton'+num+'>');
    document.write('<input TYPE=button Value=Valider onclick=boolpage['+num+']=champtesttext2(avis'+num+'[0],reponsetext'+num+',bouton'+num+'[0]);vu_metre();return(false);>');
    document.write('</form></td></tr></table></center>')

}
//*************************************************************************
//******** formulaire num *************************************************
//******** reçoit num numéro du formulaire
//********        on suppose chemin_message'num'
//*************************************************************************
function text_mes(num) 
{
	if (num < 0) num = 0;
    document.write('<center><table BORDER=0 WIDTH=75%>');

    document.write('<form name=avis'+num+' ');
    document.write('OnSubmit=boolpage['+num+']=champtesttext_mes(avis'+num+'[0],reponsetext'+num+',bouton'+num+'[0],chemin_message'+num+',compteur'+num+');vu_metre();return(false);>');
  	
    document.write('<tr><td ALIGN=CENTER>');
    
  	document.write('<input TYPE=text Value="" SIZE=15 MAXLENGTH=15 ></td></tr>');
    document.write('</form>');
    document.write('<tr><td align=right><form name=bouton'+num+'>');
    document.write('<input TYPE=button Value=Valider onclick=boolpage['+num+']=champtesttext_mes(avis'+num+'[0],reponsetext'+num+',bouton'+num+'[0],chemin_message'+num+',compteur'+num+');vu_metre();return(false);>');
    document.write('</form></td></tr></table></center>')

}


//*************************************************************************
//******** formulaire num *************************************************
//******** reçoit num numéro du formulaire
//********        text texte à écrire avant le champ
//*************************************************************************
function numeric(num, text) 
{
	if (num < 0) num = 0;
    document.write('<center><table BORDER=0 WIDTH=75%>');

    document.write('<form name=avis'+num+' ');
    document.write('OnSubmit=boolpage['+num+']=champtestnum2(avis'+num+'[0],reponsenum'+num+',bouton'+num+'[0]);vu_metre();return(false);>');
  	
    document.write('<tr><td ALIGN=CENTER>');
    
  	if (typeof(text) != "undefined") document.write(text);
  	document.write('<input TYPE=text Value="" SIZE=15 MAXLENGTH=15 ></td></tr>');
    document.write('</form>');
    document.write('<tr><td align=right><form name=bouton'+num+'>');
    document.write('<input TYPE=button Value=Valider onclick=boolpage['+num+']=champtestnum2(avis'+num+'[0],reponsenum'+num+',bouton'+num+'[0]);vu_metre();return(false);>');
    document.write('</form></td></tr></table></center>');
}

//*************************************************************************
//******** formulaire num *************************************************
//******** reçoit num numéro du formulaire
//********        mes url message de réponse
//********		  nbre_test == nombre de test avant affichage message
//********        text texte à écrire avant le champ
//*************************************************************************
function numeric_mes(num, mes, nbre_test, text) 
{
  if (num < 0) num = 0;
  document.write('<SCR'+'IPT>');
  document.write('var compteur'+num+' = new Object;');
  document.write('compteur'+num+'.iter = '+nbre_test+';');
  document.write('</SCR'+'IPT>');

    document.write('<center><table BORDER=0 WIDTH=75%>');

    document.write('<form name=avis'+num+' ');
    document.write('OnSubmit=boolpage['+num+']=champtestnum2_mes(avis'+num+'[0],reponsenum'+num+',bouton'+num+'[0],"'+mes+'",compteur'+num+');vu_metre();return(false);>');
  	
    document.write('<tr><td ALIGN=CENTER>');
    
  	if (typeof(text) != "undefined") document.write(text);
  	document.write('<input TYPE=text Value="" SIZE=15 MAXLENGTH=15 ></td></tr>');
    document.write('</form>');
    document.write('<tr><td align=right><form name=bouton'+num+'>');
    document.write('<input TYPE=button Value=Valider onclick=boolpage['+num+']=champtestnum2_mes(avis'+num+'[0],reponsenum'+num+',bouton'+num+'[0],"'+mes+'",compteur'+num+');vu_metre();return(false);>');
    document.write('</form></td></tr></table></center>')


}
//*************************************************************************
//******** formulaire num *************************************************
//******** reçoit num numéro du formulaire
//********        mes url message de réponse juste
//********        text texte à écrire avant le champ
//*************************************************************************
function numeric_mes_juste(num, mes, text)
{
  if (num < 0) num = 0;
  
    document.write('<center><table BORDER=0 WIDTH=75%>');

    document.write('<form name=avis'+num+' ');
    document.write('OnSubmit=boolpage['+num+']=champtestnum2_mes_juste(avis'+num+'[0],reponsenum'+num+',bouton'+num+'[0],"'+mes+'");vu_metre();return(false);>');
  	
    document.write('<tr><td ALIGN=CENTER>');

  	if (typeof(text) != "undefined") document.write(text);
  	document.write('<input TYPE=text Value="" SIZE=15 MAXLENGTH=15 ></td></tr>');
    document.write('</form>');
    document.write('<tr><td align=right><form name=bouton'+num+'>');
    document.write('<input TYPE=button Value=Valider onclick=boolpage['+num+']=champtestnum2_mes_juste(avis'+num+'[0],reponsenum'+num+',bouton'+num+'[0],"'+mes+'");vu_metre();return(false);>');
    document.write('</form></td></tr></table></center>')
}

// interpreteur de fonction mathématique
// Claude Giraud
// 01.05.2023

// type de symbole
const UNAIRE =  001;
const BINAIRE = 002;
const VARI =    003;
const CTE =     004;
	 
// opérateurs unaires
const MOINS =   101;
const PLUS =    102;
const SIN =     103;
const COS =     104;
const TAN =     105;
const ARCSIN =  106;
const ARCCOS =  107;
const ARCTAN =  108;
const SH =      109;
const CH =      110;
const TH =      111;
const ARGSH =   112;
const ARGCH =   113;
const ARGTH =   114;
const ABS =     115;
const FACT =    116;
const EXP =     117;
const LN =      118;
const LOG =     119;
const SQRT =    120;

//operateurs binaires
const SOMME = 	201;
const DIFF =  	202;
const MULT =  	203;
const DIV =   	204;
const PUISS = 	205;
const EGAL =  	206;

// variables
const X =       301;
const Y =       302;
const INCONNU = 303;

//constantes
const PI =      401;
const J =       403;
const AUTRE =   404;

/**********************************************************/
/******************* classe Hastable **********************/
/**********************************************************/
class Hashtable {
// constructeur de la table (tableau associatif) vierge
  constructor() {
    this.table = {};
  }

// ajout d'un couple de clef / valeur
  put(key, value) {
    this.table[key] = value;
  }

// recherche de la valeur correspondant à une clef
  get(key) {
    return this.table[key];
  }

// suppression d'une clef
  remove(key) {
    delete this.table[key];
  }

//teste si la clef existe dans la table
  containsKey(key) {
    return this.table.hasOwnProperty(key);
  }

//teste si la valeur existe dans la table
  containsValue(value) {
    for (let key in this.table) {
      if (this.table[key] === value) {
        return true;
      }
    }
    return false;
  }

// renvoie le tableau des clefs de table
  keys() {
    return Object.keys(this.table);
  }

// renvoie le tableau des valeurs de table
  values() {
    return Object.values(this.table);
  }

//efface la table
  clear() {
    this.table = {};
  }

//retourne le nombre d'éléments de la table
  size() {
    return Object.keys(this.table).length;
  }

//teste si la table est vide
  isEmpty() {
    return this.size() === 0;
  }

//retourne l'ensemble de clef / valeur de la table sous forme de texte
  toString() {
    let output = "{\n";
    for (let key in this.table) {
      output += `${key}: ${this.table[key].toString()}\n`;
    }
    output += "}";
    return output;
  }
}

/************************************************************************/
/************ classe de définition d'un nombre complexe *****************/
/********************* et des calculs afférents *************************/
/************************************************************************/
class Complexe {
    constructor(a, b) {
		//si le constructeur reçoit un complexe en a et rien en b
		if (a != null && a instanceof Complexe && b == null) {
			this.copy(a);
			return;
		}
		//si le constructeur reçoit un réel en a et rien en b
		if (a != null && b == null) {
			this.reel = a;
			this.im = 0.0;
			this.actualisePolaire();
			return;
		}
		//si le constructeur reçoit un réel en a et un réel en b		
        this.reel = a;
        this.im = b;
        this.mod = 0;
        this.argd = 0;
        this.argr = 0;
        this.actualisePolaire();
    }
	
	// constantes utiles
	static un = new Complexe(1.0, 0.0);
	static j = new Complexe(0.0, 1.0);
	
	//converti complexe en string cartesienne
	toString(){
		let output = "{";
		output += this.reel.toString();
		output += " +j";
		output += this.im.toString();
		output += "}";
		return (output);
	}
	
	//met à jour module et arguments
	actualisePolaire() {
		if (this.im == 0.0) this.mod = Math.abs(this.reel)
			else this.mod = Math.sqrt(this.reel * this.reel + this.im * this.im);
		this.argr = Math.atan2(this.im, this.reel);
		this.argd = this.toDegrees(this.argr);
	}

	//conversion rad vers degrés
	toDegrees(rad) {
		return (rad * 180.0 / Math.PI);
	}
	
	//met à jour réel et imaginaire
	actualiseCartesien() {
		this.reel = this.mod * Math.cos(this.argr);
		this.im = this.mod * Math.sin(this.argr);
		this.argd = this.toDegrees(this.argr);
	}

	//copie d'un complexe dans this
	copy(c) {
		this.reel = c.reel;
		this.im = c.im;
		this.mod = c.mod;
		this.argd = c.argd;
		this.argr = c.argr;
	}

	//teste l'égalité parfaite
	equals(obj) {
		if (obj != null && obj instanceof Complexe) {
			return (this.reel === obj.reel && this.im === obj.im);
		}
		return false;
	}

	//teste l'égalité à précision près
	pEquals(obj, prec) {
		if (obj != null && obj instanceof Complexe) {
			let c1 = new Complexe(0.0, 0.0);
			let c2 = new Complexe(0.0, 0.0);
			c1.copy(obj);
			c2.copy(this);
			c1.diff(c2);
			c1.abs();
			return (c1.reel < prec);
		}
		return false;
	}

	//arrondi à n chiffres significatifs
	round(n) {
		if (n > 0) {
			let rang;
			let log10 = Math.log(10.0);
			let r;

			r = Math.abs(this.reel);
			r = (Math.log(r) / log10);
			
			if (r >= 0.0) rang = n - Math.trunc(r) - 1;
			else rang = n - Math.trunc(r);
			r = Math.pow(10.0, rang);
			this.reel *= r;
			if (this.reel >= 0.0) this.reel = (Math.trunc(this.reel + 0.5)) / r;
			else this.reel = (Math.trunc(this.reel - 0.5)) / r;

			r = Math.abs(this.im);
			r = (Math.log(r) / log10);
			if (r >= 0.0) rang = n - (Math.trunc(r)) - 1;
			else rang = n - (Math.trunc(r));
			r = Math.pow(10.0, rang);
			this.im *= r;
			if (this.im >= 0.0) this.im = (Math.trunc(this.im + 0.5)) / r;
			else this.im = (Math.trunc(this.im - 0.5)) / r;
		}
	}

	//teste si reel pur ou imaginaire pur
	isReel() {
		return (this.im === 0.0);
	}

	isImaginaire() {
		return (this.reel === 0.0);
	}

	//teste si NaN
	isNaN() {
		return (isNaN(this.reel) || isNaN(this.im));
	}

	//teste si infini
	isInfinite() {
		let bool = !isFinite(this.reel) || !isFinite(this.im);
		return bool;
	}

	//teste si particulier
	isParticulier() {
		return (this.isNaN() || this.isInfinite());
	}

	//opérateurs binaires
	somme(c) {
		this.reel += c.reel;
		this.im += c.im;
		this.actualisePolaire();
	}

	diff(c) {
		this.reel -= c.reel;
		this.im -= c.im;
		this.actualisePolaire();
	}

	mult(c) {
		this.mod *= c.mod;
		this.argr += c.argr;
		this.actualiseCartesien();
	}

	div(c) {
		this.mod /= c.mod;
		this.argr -= c.argr;
		this.actualiseCartesien();
	}

	
	puiss(c) {
		//calcul de puissance si c est réel
		if (c instanceof Complexe) {
			if (c.isReel()) {
				this.mod = Math.pow(this.mod, c.reel);
				this.argr *= c.reel;
			}
			else this.mod = 0.0 / 0.0;
		}
		if ((c - 0) === c) {
			this.mod = Math.pow(this.mod, c);
			this.argr *= c;
		}
		else this.mod = 0.0 / 0.0;
		this.actualiseCartesien();
		this.actualisePolaire();
	}



	//operateur unaires
	moins() {
	  this.reel = -this.reel;
	  this.im = -this.im;
	  this.actualisePolaire();
	}

	plus() {
	}

	abs() {
	  this.reel = Math.sqrt(this.reel * this.reel + this.im * this.im);
	  this.im = 0.0;
	  this.actualisePolaire();
	}

	
	fact() {
		//calcul de factorielle si c'est un nombre réel
		if (this.isReel() && (this.reel < 100) && (this.reel >= 0)) {
			let r = 1.0;
			let i;
			for (i = 1.0; i <= this.reel; i++) {
			r = r * i;
		}
		this.reel = r;
		this.actualisePolaire();
	  } else {
		this.reel = 0.0 / 0.0;
		this.im = 0.0 / 0.0;
		this.actualisePolaire();
	  }
	}
	
	//Pseudo exp pour éviter les valeurs qui tendent trop rapidement vers infinity
	exp() {
	  let a = this.reel;
	  //this.reel = Math.exp(a) * Math.cos(this.im);
	  this.reel = Math.pow(1+100000*Number.EPSILON, a) * Math.cos(this.im);
	  //this.im = Math.exp(a) * Math.sin(this.im);
	  this.im = Math.pow(1+100000*Number.EPSILON, a) * Math.sin(this.im);
	  this.actualisePolaire();
	}

	ln() {
	  this.reel = Math.log(this.mod);
	  this.im = this.argr;
	  this.actualisePolaire();
	}

	log() {
	  let c1 = new Complexe(this.reel, this.im);
	  c1.this.ln();
	  c1.this.div(new Complexe(Math.log(10.0)));
	  this.reel = c1.reel;
	  this.im = c1.im;
	  this.actualisePolaire();
	}

	racine() {
	  this.mod = Math.sqrt(this.mod);
	  this.argr /= 2.0;
	  this.actualiseCartesien();
	}

	sin() {
	  if (this.isReel()) {
		this.reel = Math.sin(this.reel);
	  } else {
		let c1 = new Complexe(this.reel, this.im);
		let c2 = new Complexe(-this.reel, -this.im);
		c1.mult(Complexe.j);
		c1.exp();
		c2.mult(Complexe.j);
		c2.exp();
		c1.diff(c2);
		c1.div(new Complexe(0.0, 2.0));
		this.reel = c1.reel;
		this.im = c1.im;
	  }
	  this.actualisePolaire();
	}

	cos() {
	  if (this.isReel()) {
		this.reel = Math.cos(this.reel);
	  } else {
		let c1 = new Complexe(this.reel, this.im);
		let c2 = new Complexe(-this.reel, -this.im);
		c1.mult(Complexe.j);
		c1.exp();
		c2.mult(Complexe.j);
		c2.exp();
		c1.somme(c2);
		c1.div(new Complexe(2.0));
		this.reel = c1.reel;
		this.im = c1.im;
	  }
	  this.actualisePolaire();
	}

	tan() {
	  if (this.isReel()) {
		this.reel = Math.tan(this.reel);
	  } else {
		let j2 = new Complexe(0.0, 2.0);
		let c1 = new Complexe(-this.reel, -this.im);
		let c2 = new Complexe(-this.reel, -this.im);
		c1.mult(j2);
		c1.exp();
		c1.diff(Complexe.un);
		c2.mult(j2);
		c2.exp();
		c2.somme(Complexe.un);
		c1.div(c2);
		c1.mult(Complexe.j);
		this.reel = c1.reel;
		this.im = c1.im;
	  }
	  this.actualisePolaire();
	}

	arcsin() {
	  if (this.isReel() && (this.reel <= 1) && (this.reel >= -1)) {
		this.reel = Math.asin(this.reel);
	  } else {
		let c1 = new Complexe(this.reel, this.im);
		let c2 = new Complexe(this.reel, this.im);
		c1.mult(c1);
		c1.moins();
		c1.somme(Complexe.un);
		c1.racine();
		c2.mult(Complexe.j);
		c1.somme(c2);
		c1.ln();
		c1.mult(Complexe.j);
		c1.moins();
		this.reel = c1.reel;
		this.im = c1.im;
	  }
	  this.actualisePolaire();
	}

	arccos() {
	  if (this.isReel() && (this.reel <= 1) && (this.reel >= -1)) {
		this.reel = Math.acos(this.reel);
	  } else {
		let c1 = new Complexe(this.reel, this.im);
		let c2 = new Complexe(this.reel, this.im);
		c1.mult(c1);
		c1.moins();
		c1.somme(Complexe.un);
		c1.racine();
		c1.mult(Complexe.j);
		c1.somme(c2);
		c1.ln();
		c1.mult(Complexe.j);
		c1.moins();
		this.reel = c1.reel;
		this.im = c1.im;
	  }
	  this.actualisePolaire();
	}

	arctan() {
	  if (this.isReel()) {
		this.reel = Math.atan(this.reel);
	  } else {
		let c1 = new Complexe(this.reel, this.im);
		let c2 = new Complexe(this.reel, this.im);
		c1.mult(Complexe.j);
		c1.somme(Complexe.un);
		c2.mult(Complexe.j);
		c2.moins();
		c2.somme(Complexe.un);
		c1.div(c2);
		c1.ln();
		c1.div(Complexe.j);
		c1.div(new Complexe(2.0));
		this.reel = c1.reel;
		this.im = c1.im;
	  }
	  this.actualisePolaire();
	}

	sh() {
	  let c1 = new Complexe(this.reel, this.im);
	  let c2 = new Complexe(this.reel, this.im);

	  c1.exp();
	  c2.moins();
	  c2.exp();
	  c1.diff(c2);
	  c1.div(new Complexe(2.0));
	  this.reel = c1.reel;
	  this.im = c1.im;
	  this.actualisePolaire();
	}

	ch() {
	  let c1 = new Complexe(this.reel, this.im);
	  let c2 = new Complexe(this.reel, this.im);

	  c1.exp();
	  c2.moins();
	  c2.exp();
	  c1.somme(c2);
	  c1.div(new Complexe(2.0));
	  this.reel = c1.reel;
	  this.im = c1.im;
	  this.actualisePolaire();
	}

	th() {
	  let c1 = new Complexe(this.reel, this.im);
	  let c2 = new Complexe(this.reel, this.im);

	  c1.sh();
	  c2.ch();
	  c1.div(c2);
	  this.reel = c1.reel;
	  this.im = c1.im;
	  this.actualisePolaire();
	}

	argsh() {
	  if (this.isReel()) {
		this.reel = Math.log(this.reel + Math.sqrt((1 + this.reel * this.reel)));
	  } else {
		let c1 = new Complexe(this.reel, this.im);
	    c1.mult(Complexe.j);
	    c1.arcsin();
	    c1.div(Complexe.j);
	    this.reel = c1.reel;
	    this.im = c1.im;
	  }
	  this.actualisePolaire();
	}

	argch() {
	  if (this.isReel() && (this.reel >= 1.0)) {
		this.reel = Math.log(this.reel + Math.sqrt((-1 + this.reel * this.reel)));
	  } else {
		let c1 = new Complexe(this.reel, this.im);
		c1.arccos();
		c1.div(Complexe.j);
		c1.moins();
		this.reel = c1.reel;
		this.im = c1.im;
	  }
	  this.actualisePolaire();
	}

	argth() {
	  if (this.isReel() && (this.reel > -1) && (this.reel < 1)) {
		this.reel = Math.log((1 + this.reel) / (1 - this.reel)) / 2.0;
	  } else {
		let c1 = new Complexe(this.reel, this.im);
		c1.mult(Complexe.j);
		c1.arctan();
		c1.div(Complexe.j);
		this.reel = c1.reel;
		this.im = c1.im;
	  }
	  this.actualisePolaire();
	return;
	}
}

/***********************************************************/
/******************* classe des Constantes *****************/
/***********************************************************/
class Constantes {
  constructor() {
    this.Cte = new Hashtable();
    this.clear();
  }

  clear() {
    this.Cte.clear();
    this.setValeur("pi", new Complexe(Math.PI));
    // this.setValeur("e", new Complexe(Math.E)); problème de distinction avec variable E
    this.setValeur("j", new Complexe(0.0, 1.0));
  }

  getValeur(nom) {
    if (this.Cte.containsKey(nom)) {
      return this.Cte.get(nom);
    } else {
      // return new Complexe(0.0 / 0.0, 0.0 / 0.0);
      return null;
    }
  }

  setValeur(nom, val) {
    if (this.Cte.containsKey(nom)) this.Cte.remove(nom);
    this.Cte.put(nom, new Complexe(val));
  }
}

/***********************************************************/
/******************* classe des Variables ******************/
/***********************************************************/
class Variables {
    constructor() {
        this.Var = new Hashtable();
        this.clear();
		this.liste = "";
    }
	
	//efface et initialise la hashtable
    clear() {
        this.Var.clear();
        this.setValeur("x", new Complexe(301));
        this.setValeur("y", new Complexe(302));
    }

	//récupère la valeur associée à la clef nom
    getValeur(nom) {
        if (this.Var.containsKey(nom)) {
            return this.Var.get(nom);
        } else {
            return null;
        }
    }

	//initialise un couple clef (nom), valeur (val)
    setValeur(nom, val) {
        if (this.Var.containsKey(nom)) this.Var.remove(nom);
        this.Var.put(nom, new Complexe(val));
    }

	//teste égalité entre deux classes variables (clefs seulement)
    equals(val) {
        let c;
		let test = new Boolean(true);
        if (this.Var.size() !== val.Var.size()) return false;
        else {
			for (let key of this.Var.keys()){
                c = val.getValeur(key);
				test &= (c != null);
            }
        }
		return test;
    }

	//initialisation aléatoire des valeurs de la hashtable 
    randomInit() {
        let c;
        let a, b;
        for (let key of this.Var.keys()) {
            do {
                a = 2.0 * Math.random() - 1.0;
            } while (a === 0.0);
            do {
                b = 2.0 * Math.random() - 1.0;
            } while (b === 0.0);
            let c = new Complexe(a, b);
            this.setValeur(key, c);
        }
    }

    //multiplie toutes les valeurs par r
    mult(r) {
        let c;
        for (let key of this.Var.keys()) {
            c = new Complexe(this.getValeur(key));
            c.mult(new Complexe(r));
            this.setValeur(key, c);
        }
    }

    //recopie le contenu de la hashtable de val dans this
    copy(val) {
        let c;
        for (let key of val.Var.keys()) {
            c = val.getValeur(key);
            this.setValeur(key, c);
        }
    }
	
	//range dans liste la description des variables 	
	lister() { 
		this.liste = "";
		for (let key of this.Var.keys()) {
			this.liste += key + " = " + this.getValeur(key).reel + "+j" + this.getValeur(key).im + "; "; 
		}	
	return; 	
	} 
}

/***********************************************************/
/******************* classe des Fonctions ******************/
/***********************************************************/
class Fonctions { 
	constructor() { 
		this.Fonc = new Hashtable();
		this.clear();
	}

	clear() { 
		this.Fonc.clear(); 
		//operateurs unaires 
		this.setValeur("moins", 101); 
		this.setValeur("plus", 102); 
		this.setValeur("sin", 103); 
		this.setValeur("cos", 104); 
		this.setValeur("tan", 105); 
		this.setValeur("arcsin", 106); 
		this.setValeur("arccos", 107); 
		this.setValeur("arctan", 108); 
		this.setValeur("sh", 109); 
		this.setValeur("ch", 110); 
		this.setValeur("th", 111); 
		this.setValeur("argsh", 112); 
		this.setValeur("argch", 113); 
		this.setValeur("argth", 114); 
		this.setValeur("abs", 115); 
		this.setValeur("!", 116); 
		this.setValeur("exp", 117); 
		this.setValeur("ln", 118); 
		this.setValeur("log", 119); 
		this.setValeur("sqrt", 120); 
		//operateurs binaires 
		this.setValeur("+", 201); 
		this.setValeur("-", 202); 
		this.setValeur("*", 203); 
		this.setValeur("/", 204); 
		this.setValeur("^", 205); 
		this.setValeur("=", 206); 
	}

	getValeur(nom) {
		if (this.Fonc.containsKey(nom)) {
			return this.Fonc.get(nom);
		} else {
			return 0;
		}
	}

	setValeur(nom, code) {
		if (this.Fonc.containsKey(nom)) this.Fonc.remove(nom);
		this.Fonc.put(nom, code);
	}
 }
 
/************************************************************************/
/******************* classe de définition Symbole ***********************/
/************************************************************************/
class Symbole { 
	constructor(type, soustype, nom, val) { 
		if (type instanceof Symbole){
			this.sType = type.getType(); 
			this.sSousType = type.getSousType(); 
			this.sNom = type.getNom(); 
			if (this.sValeur == null) this.sValeur = new Complexe(type.getValeur()); 
			else this.sValeur.copy(type.getValeur());
			return;
		}
		
		this.sType = type; 
		this.sSousType = soustype; 
		this.sNom = nom; 
		this.sValeur = val; 
		return;
	}

	getNom() { 
		return this.sNom; 
	}

	getValeur() { 
		return this.sValeur; 
	}

	getType() {
		return this.sType;
	}

	getSousType() { 
		return this.sSousType; 
	}

	//initialise un symbole en fonction du contenu de fonc, vari et cte
	initialise(val, fonc, vari, cte) { 
		let c; 
		let stype = fonc.getValeur(val); 
		if (stype < 121 && stype > 100) { 
			this.sNom = val; 
			this.sType = UNAIRE; 
			this.sSousType = stype; 
			this.sValeur = new Complexe(0.0 / 0.0, 0.0 / 0.0); 
			return true; 
		} 
		if (stype < 207 && stype > 200) { 
			this.sNom = val; 
			this.sType = BINAIRE; 
			this.sSousType = stype; 
			this.sValeur = new Complexe(0.0 / 0.0, 0.0 / 0.0); 
			return true;
		} 
		c = cte.getValeur(val); 
		if (c != null) { 
			this.sNom = val; 
			this.sType = CTE; 
			switch (val.charAt(0)) { 
				case 'p': 
					if (val == "pi") this.sSousType = 401; 
					else this.sSousType = 404; 
					break; 
				case 'j': 
					this.sSousType = 403; 
					break; 
				default: this.sSousType = 404; 
			} 
			this.sValeur = new Complexe(c); 
			return true; 
		}
		
		c = vari.getValeur(val); 
		if (c != null) { 
			this.sNom = val; 
			this.sType = VARI; 
			switch (val.charAt(0)) { 
				case 'x': this.sSousType = 301; 
					break; 
				case 'y': this.sSousType = 302; 
					break; 
				default: this.sSousType = 303; 
			} 
			this.sValeur = new Complexe(c); 
			return true; 
		} 
		
		
		return false; 
	}
	

	//initialise un symbole en fonction du contenu vari et cte
	initialise2(val, vari, cte) {
		let c;
		c = cte.getValeur(val);
		if (c != null) {
			this.sNom = val;
			this.sType = CTE;
			switch (val.charAt(0)) {
				case 'p':
					if (val == "pi") this.sSousType = 401;
					else this.sSousType = 404;
					break;
				case 'j':
					this.sSousType = 403;
					break;
				default:
					this.sSousType = 404;
			}
			this.sValeur = new Complexe(c);
			return true;
		}
		c = vari.getValeur(val);
		if (c != null) {
			this.sNom = val;
			this.sType = VARI;
			switch (val.charAt(0)) {
				case 'x':
					this.sSousType = 301;
					break;
				case 'y':
					this.sSousType = 302;
					break;
				default:
					this.sSousType = 303;
			}
			this.sValeur = new Complexe(c);
			return true;
		}
		
		return false;
	}
	
	copy(val) { 
		this.sType = val.getType(); 
		this.sSousType = val.getSousType(); 
		this.sNom = val.getNom(); 
		if (this.sValeur == null) this.sValeur = new Complexe(val.getValeur()); 
		else this.sValeur.copy(val.getValeur()); 
		return; 
	} 
}

/************************************************************************/
/******************* classe de définition Noeud *************************/
/************************************************************************/
class Noeud{ 
	//constructeur en fonction du type de val (symbole, noeud ou rien)
	constructor(val) { 		 
		if (val instanceof Symbole){
			this.sym = new Symbole(val); 
			this.fd = null; 
			this.fg = null;
			return;
		}
		if (val instanceof Noeud){
			this.sym = new Symbole(val.sym); 
			this.fg = val.fg; 
			this.fd = val.fd;
			return;
		}
		this.sym = null; 
		this.fd = null; 
		this.fg = null;
		return;
	}

	//retourne le nom du symbole du noeud
	getNom() { 
		if (this.sym == null) return null; 
		else return this.sym.getNom(); 
	}

	//retourne le type du symbole du noeud
	getType() { 
		if (this.sym == null) return -1; 
		else return this.sym.getType(); 
	}

	//retourne le soustype du symbole du noeud
	getSousType() { 
		if (this.sym == null) return -1; 
		else return this.sym.getSousType(); 
	} 
}

/************************************************************************/
/******************* classe de définition Arbre *************************/
/************************************************************************/
class Arbre { 
	//Constructeur
	constructor(val) { 
		if (val != null) { 
			this.racine = new Noeud(val);
		}
		else {
			this.racine = null; 
		}
		this.liste = ""; 
	}
	
	//retourne le champ nom du symbole contenu dans la racine, la feuille gauche et droite
	getRacineNom() { 
		return this.racine.getNom(); 
	}

	getFgNom() { 
		if(this.racine.fg == null) return null; 
		else return this.racine.fg.getNom(); 
	}

	getFdNom() { 
		if(this.racine.fd == null) return null; 
		else return this.racine.fd.getNom(); 
	}

	//insertion d'un noeud n2 à l'emplacement de n1
	//si n1 != null, création d'un noeud avec s, n1 dans feuille droite et n2 dans feuille gauche
	insere(n1, n2, s) { 
		if (n1 == null) return n2; 
		else { 
			let a = new Noeud(s); 
			a.fd = n1; 
			a.fg = n2; 
			return a; 
		} 
	}

	//supprime noeud n et la branche qui en descend
	supprimer(n) { 
		if (n == null) return null; 
		if (n.fg == null && n.fd == null) { 
			n = null; 
			return n; 
		} 
		if (n.fd == null) { 
			n.fg = this.supprimer(n.fg); 
			n = null; 
			return n; 
		} 
		if (n.fg == null) { 
			n.fd = this.supprimer(n.fd); 
			n = null; 
			return n; 
		} 
		else { 
			n.fg = this.supprimer(n.fg); 
			n.fd = this.supprimer(n.fd); 
			n = null; 
			return n; 
		} 
	}

	//range dans liste la description de l'arbre avec le nom du champ symbole de 
	//chaque noeud et de ses feuilles.		
	lister(n) { 
		if (n != null) { 
			this.liste += n.getNom() + " "; 
			if (n == null) return this.liste + "fin; "; 
			if (n.fg == null && n.fd == null) { 
				return this.liste + "fin; "; 
			}
			if (n.fg == null) { 
				this.liste += "fg_null " + n.fd.getNom() + "; "; 
				this.liste = this.lister(n.fd); 
				return this.liste; 
			} 
			if (n.fd == null) { 
				this.liste += "fd_null " + n.fg.getNom() + "; "; 
				this.liste = this.lister(n.fg); 
				return this.liste; 
			} 
			else { 
				this.liste += n.fg.getNom() + " "; 
				this.liste += n.fd.getNom() + "; "; 
				this.liste = this.lister(n.fg); 
				this.liste = this.lister(n.fd); 
				return this.liste; 
			} 
		}
		else return "null"; 	
	} 
}

/************************************************************************/
/******** classe de traitement d'une expresion mathématique *************/
/************************************************************************/
class Expression {
	constructor(ch) {
		// texte de l'expression
		this.texte = "";
		this.index = 0;
		
		// texte de d'erreur
		this.err = "";

		// arbre de décomposition de l'Expression		
		this.arbre = new Arbre();
		
		//hastable des fonctions, variables et constantes de l'Expression
		this.fonc = new Fonctions();
		this.vari = new Variables();
		this.cte = new Constantes();
		
		//supprime les espaces et remplace les ',' par des '.'
		//construit l'arbre
		if (ch==null) this.err = "chaine nulle";
		else {
			if(ch.length>0) {
				let i = 0;
				let c;
				while (i<ch.length) {
					c = ch.charAt(i);
					if(c == ',') c = '.';
					if(c != ' ') this.texte += c;
					i++;
				}
				this.index = 0;
				this.construitArbre();
			}
			else this.err = "chaine vide";
			//ajouter traitement d'erreur de construction
		}
	}	

	//fonction de saut de parenthèses à partir du caractère i
	//dans la direction "sens". retourne vrai si trouvé 
	//parenthèse fermante et pointe dessus
	//retourne faux sinon et pointe dessus
	sauteParenthese(i, sens, exp) {
		let compteur = 0;
		do {
			switch(exp.charAt(i)) {
				case '(': compteur += 1; break;
				case ')': compteur -= 1; break;
			}
			i += sens;
		} while ((compteur!=0)&&(i<(exp.length))&&(i>=0));
		
		i -= sens;
		if (compteur==0) {
			this.index = i;
			return(true);
		}
		else {
			this.err = "problème de parenthèses";
			return(false);
		}
	}

	//developpe une branche unaire avec exp expression textuelle droite 
	//et symb symbole du noeud
	brancheUnaire(exp, symb) {
		let sym = new Symbole(0);
		let gagne = true;
		gagne &= sym.initialise(symb, this.fonc, this.vari, this.cte);
		if (gagne) {
			let n = new Noeud(sym);
			n.fd = this.elaboreArbre(exp);
			return(n);
		}
		else {
			this.err = "symbole unaire nom répertorié";
			return(null);
		}
	}

	//developpe une branche binaire avec exp1 expression textuelle à gauche
	//exp2 expression textuelle à droite
	//et symb symbole du noeud	
	 brancheBinaire(exp1, exp2, symb) {
		let sym = new Symbole(0);
		let gagne = true;
		gagne &= sym.initialise(symb, this.fonc, this.vari, this.cte);
		if (gagne) {
			let n = new Noeud(sym);
			n.fg = this.elaboreArbre(exp1);
			n.fd = this.elaboreArbre(exp2);
			return(n);
		}
		else {
			this.err = "symbole binaire nom répertorié";
			return(null);
		}
	}
	
	//trouve le caractère c parmis =, +, -, *, /, ^
	//en tant que operateur binaire
	//revoie null pour + et - unaire
	trouve (c, texte) {
		let ncourant = new Noeud(); //noeud
		let i = texte.length - 1; //int
		let post;	//char
		let ante, antep; //char
		let avant = new String(); //string
		let apres = new String(); //string
		let symb = c; //string
		do {
			if (texte.charAt(i) == ')') {
				if (this.sauteParenthese(i, -1, texte)) i = this.index;
				else return (null);
			}
			if (texte.charAt(i) == c) {
				if((c=='+')||(c=='-')) {//cas du + et - avec distinction unaire/binaire		
					if ((i>0)&&(i<texte.length-1)) {	
						ante = texte.charAt(i-1);
						
						if((ante=='(')||(ante=='=')||(ante=='*')||(ante=='/')||(ante=='^')) {i -= 1; continue;}//break;
						
						if((ante=='e')||(ante=='E')) {
							if (i>=2) {
								antep = texte.charAt(i-2);
								if (antep >= '0' && antep <= '9') {
									i -= 1; 
									continue;
								}
							} 	
						}
						
						if((ante=='+')||(ante=='-')) {i -= 1; continue;}
						post = texte.charAt(i+1);
						if ((post=='=')||(post=='*')||(post=='/')||(post=='^'))	{//||(post==')')	
							this.err = "syntaxe fausse : deux opérateurs contigus";
							return(null);
						}
						if (post==')') {
							this.err = "problème de parenthèses";
							return(null);
						}
						
						avant = texte.substring(0, i);
						apres = texte.substring(i+1, texte.length);
						ncourant = this.brancheBinaire(avant, apres, symb);
						return(ncourant);			
					}
					else {
						if(i==texte.length-1) {
							this.err = "syntaxe fausse : opérateur en fin d'expression";
							return(null);
						}
					}

				}
				else {//autre cas que + et -
					if ((i>0)&&(i<texte.length-1)) {
						post = texte.charAt(i+1);
						ante = texte.charAt(i-1);
						
						if(ante=='(') {
							this.err = "problème de parenthèses";
							return(null);
						}
						/*if(ante=='E')//||(ante==c))
						{
							err = "syntaxe fausse : deux opérateurs contigus";
							return(null);
						}
						if(post=='(')
						{
							err = "problème de parenthèses";
							return(null);
						}*/
						if((ante=='=')||(ante=='*')||(ante=='/')||(ante=='^')) {
							this.err = "syntaxe fausse : deux opérateurs contigus";
							return(null);
						}
						if((ante=='e')||(ante=='E')) {
							if (i>=2) {
								antep = texte.charAt(i-2);
								if (antep >= '0' && antep <= '9') {
									this.err = "syntaxe fausse : deux opérateurs contigus";
									return(null);
								}
							} 
						}
						
						avant = texte.substring(0, i);
						apres = texte.substring(i+1, texte.length);
						ncourant = this.brancheBinaire(avant, apres, symb);
						return(ncourant);
					}
					else {
						this.err = "syntaxe fausse : opérateur mal placé";
						return(null);
					}
				}
			}
			i -= 1;
		} while(i>=0);
		return(null);
	}

	
	//construction récursive de l'arbre 
	elaboreArbre(exp) {
		let ncourant = new Noeud();
		let s = new Symbole(0);
		let l = exp.length;
		if (exp == null) return(null);
		
		//recherche opérateurs binaires
		ncourant = this.trouve('=', exp);
		if (ncourant!=null) return(ncourant);
		if (this.err.length>0) return(null);
				
		ncourant = this.trouve('+', exp);
		if (ncourant!=null) return(ncourant);
		if (this.err.length>0) return(null);
		
		ncourant = this.trouve('-', exp);
		if (ncourant!=null) return(ncourant);
		if (this.err.length>0) return(null);
		
		ncourant = this.trouve('*', exp);
		if (ncourant!=null) return(ncourant);
		if (this.err.length>0) return(null);

		ncourant = this.trouve('/', exp);
		if (ncourant!=null) return(ncourant);
		if (this.err.length>0) return(null);
		
		ncourant = this.trouve('^', exp);
		if (ncourant!=null) return(ncourant);
		if (this.err.length>0) return(null);
		
		//recherche - et + unaires
		if (exp.charAt(0)=='-') ncourant = this.brancheUnaire(exp.substring(1, l), "moins");
		if (ncourant!=null) return(ncourant);
		if (this.err.length>0) return(null);
		
		if (exp.charAt(0)=='+') ncourant = this.brancheUnaire(exp.substring(1, l), "plus");
		if (ncourant!=null) return(ncourant);
		if (this.err.length>0) return(null);
		
		//saute parenthèse de début et de fin
		if (exp.charAt(0) == '(') {
			this.index = 0;
			this.sauteParenthese(this.index, 1, exp);
			if (this.index == l-1) {
				ncourant = this.elaboreArbre(exp.substring(1, l-1));
				if (ncourant!=null) return(ncourant);
				if (this.err.length>0) return(null);
			}
		}
										
		//recherche factorielle
		if (exp.charAt(l-1)=='!') ncourant = this.brancheUnaire(exp.substring(0, l-1), "!");
		if (ncourant!=null) return(ncourant);
		if (this.err.length>0) return(null);
		
		//recherche fonctions unaires
		let j = 2;
		let f = new String(); //string
		let f1;	//char
		while ((j<=6)&&(j<l-2))	{
			f = exp.substring(0, j);
			f = f.toLowerCase();
		    f1 = exp.charAt(j);
			 let stype = this.fonc.getValeur(f);

			if ((stype<121)&&(stype>100)) {
				if (f1 == '(') {
					ncourant = this.brancheUnaire(exp.substring(j, l), f);
					if (ncourant!=null) return(ncourant);
				}
				else {
					this.err = "syntaxe fausse : parenthèse manquante";
					return(null);
				}
			}
			j++;		
		}
		
		//recherche constantes et variables
		//f = exp.toLowerCase();
		f = exp;
		if (s.initialise2(f, this.vari, this.cte)) { //constante ou variable préexistante
			ncourant = new Noeud(s);
			if (ncourant!=null) return(ncourant);
		}
		
		else {//Constante ou variable à ajouter
			let reel = Number(exp);
			if (!isNaN(reel)) {	
				s.sNom = exp;
				s.sType = CTE;
				s.sSousType = 404; 
				s.sValeur = new Complexe(reel);
				this.cte.setValeur(exp, s.sValeur);
				return(new Noeud(s));
			}
			else {	
				if ((exp.indexOf('(')!=-1)||(exp.indexOf(')')!=-1)) {
					this.err = "erreur de syntaxe proche d'une parenthèse";
					return(null);
				}
				s.sNom = exp;
				s.sType = VARI;
				s.sSousType = 303; 
				s.sValeur = new Complexe(0.0, 0.0);
				this.vari.setValeur(exp, s.sValeur);
				return(new Noeud(s));
			}
		}	
		return(null);
	}

	//construction de l'arbre avec effacement si erreur
	construitArbre() {
		this.arbre.racine = this.elaboreArbre(this.texte);
	    if (this.err.length > 1) {
	    	this.arbre.racine = this.arbre.supprimer(this.arbre.racine);
	    	return(false);
	    }
	    else return(true);
	}
	
	//calcule recurcivement expression à partir de n en descendant
	calcule(n) {
		let c = new Complexe(0.0/0.0, 0.0/0.0);
		let d = new Complexe(0.0/0.0, 0.0/0.0);
		switch(n.getType()) {
			case CTE: c.copy(this.cte.getValeur(n.getNom())); break;
			case VARI: c.copy(this.vari.getValeur(n.getNom())); break;
			case UNAIRE: 
				c.copy(this.calcule(n.fd));
				switch(n.getSousType()) {
					case MOINS : c.moins(); break;
					case PLUS : c.plus(); break;
					case SIN : c.sin(); break;
					case COS : c.cos(); break;
					case TAN : c.tan(); break;
					case ARCSIN : c.arcsin(); break;
					case ARCCOS : c.arccos(); break;
					case ARCTAN : c.arctan(); break;
					case SH : c.sh(); break;
					case CH : c.ch(); break;
					case TH : c.th(); break;
					case ARGSH : c.argsh(); break;
					case ARGCH : c.argch(); break;
					case ARGTH : c.argth(); break;
					case ABS : c.abs(); break;
					case FACT : c.fact(); break;
					case EXP : c.exp(); break;
					case LN : c.ln(); break;
					case LOG : c.log(); break;
					case SQRT : c.racine(); break;
					default : this.err = "opérateur unaire inconnu"; return(new Complexe(0.0/0.0, 0.0/0.0));
				}	
				break;
			case BINAIRE: 
				c.copy(this.calcule(n.fg));
				d.copy(this.calcule(n.fd));
				switch(n.getSousType()) {
					case SOMME : c.somme(d); break;
					case DIFF : c.diff(d); break;
					case MULT : c.mult(d); break;
					case DIV : c.div(d); break;
					case PUISS : if (d.isReel()) {c.puiss(d.reel); break;}
								else {this.err = "nombre réel requis pour le calcul d'une puissance"; return(new Complexe(0.0/0.0, 0.0/0.0));}	
					case EGAL : c.copy(d); this.vari.setValeur(n.fg.getNom(), d); break;
					default : this.err = "opérateur binaire inconnu"; return(new Complexe(0.0/0.0, 0.0/0.0));
				}
			break;
		}
		return(c);
	}
	
	//calcule à partir de la racine
	calculer() {
		return(this.calcule(this.arbre.racine));	
	}
	
	//calcule à partir de fg
	calculeg() {
		return(this.calcule(this.arbre.racine.fg));	
	}
	
	//calcule à partir de fd
	calculed() {
		return(this.calcule(this.arbre.racine.fd));	
	}
	
	//teste si la hashtable contenue dans val est équivalente
	//à celle de this (teste clefs et valeurs)
	testVar(val) {
		return(this.vari.equals(val.vari));	
	}
		
	//initialise les variables aléatoirement
	randomVariables() {
		this.vari.randomInit();
    }
 
 	//multiplie toutes les variables par r
    multVariables(r) {
		this.vari.mult(r);
    }
	
    //teste égalité (relative) entre expression this et expression val
    //sans initialiser les variables de this
    teste(val) {
    	let c = new Complexe(this.calculer());
    	if (c.isParticulier()) return(-1);
		val.vari.copy(this.vari);
		val.vari.lister();
		this.vari.lister();
		let c1 = new Complexe(val.calculeg());
		if (c1.isParticulier()) return(-2);
		let c2 = new Complexe(val.calculed());
		if (c2.isParticulier()) return(-3);
		
		if(c1.pEquals(c2, 2E-2)) return(1);
		else return(0);
	}
			 
    //teste égalité (relative) entre expression this et expression val
    //avec initialisation aléatoire des variables de this
    testAlea(val) {
    	let i = 0;
    	do {
			this.randomVariables();
			c = new Complexe(this.calculer());
			val.vari.copy(this.vari);
			c1 = new Complexe(val.calculeg());
			c2 = new Complexe(val.calculed());	
			i++;				
		} while ((c1.isParticulier()||c2.isParticulier()||c.isParticulier()) && (i<10));
		if(i==10) {
			this.err = "fonction singulière: à reformuler ou à simplifier";
			return(false);
		}
		if(c1.pEquals(c2, 2E-2)) return(true);
		else return(false);
	}
	
	//teste égalité (relative) entre expression this et expression val
    //avec initialisation des variables et test dans toutes les directions
    //constituant une base.
    //dans une direction donnée teste périodicité avec une valeur aléatoire 
	compareA(val) {
		//let sym = new String();
		 
		if(!this.testVar(val)) {
			this.err = "variables suspectes dans l'expression";
			return(false);
		}
		do {
			this.randomVariables();
		} while (this.calculer().isNaN());
		
		for (let key of this.vari.Var.keys()) {
			let rep;
			let i = 0;
			//let sym = new String(key);
			let c0 = new Complexe(this.vari.getValeur(key));
			let c00 = new Complexe(c0);
			
			//exploration aléatoire dans une direction donnée (ici traitement des réels)
			//recommence si singularité rencontrée.
			do {
				if (Math.random() > 0.5) c0.somme(new Complexe(Math.random()+Number.MIN_VALUE, 0.0));
				else c0.diff(new Complexe(Math.random()+Number.MIN_VALUE, 0.0));
				this.vari.setValeur(key, c0);
				rep = this.teste(val);
				if(rep == 0) return(false);
				i++;
			} while ((rep<0)&&(i<10));
			
			if(i==10) {
				this.err = "fonction singulière: à reformuler ou à simplifier";
				return(false);
			}
			i = 0;
			
			//exploration aléatoire bis dans une direction donnée (ici traitement des imaginairess)
			//afin d'éviter les problèmes de périodicité, recommence si singularité rencontrée.
			do {
				if (Math.random() > 0.5) c0.somme(new Complexe(Math.random()+Number.MIN_VALUE, 0.0));
				else c0.diff(new Complexe(Math.random()+Number.MIN_VALUE, 0.0));
				this.vari.setValeur(key, c0);
				rep = this.teste(val);
				if(rep == 0) return(false);
				i++;
			} while ((rep<0)&&(i<10));
			
			if(i==10) {
				this.err = "fonction singulière: à reformuler ou à simplifier";
				return(false);
			}
			i = 0;
			
			//retour à valeur initiale
			this.vari.setValeur(key, c00);
			
			//exploration aléatoire dans une direction donnée (ici traitement des imaginaires)
			//recommence si singularité rencontrée.
			do {
				if (Math.random() > 0.5) c0.somme(new Complexe(0.0, Math.random()+Number.MIN_VALUE));
				else c0.diff(new Complexe(0.0, Math.random()+Number.MIN_VALUE));
				this.vari.setValeur(key, c0);
				rep = this.teste(val);
				if(rep == 0) return(false);
				i++;
			} while ((rep<0)&&(i<10));
			
			if(i==10) {
				this.err = "fonction singulière: à reformuler ou à simplifier";
				return(false);
			}
			i = 0;
			
			//exploration aléatoire bis dans une direction donnée (ici traitement des imaginairess)
			//afin d'éviter les problèmes de périodicité, recommence si singularité rencontrée.
			do {
				if (Math.random() > 0.5) c0.somme(new Complexe(0.0, Math.random()+Number.MIN_VALUE));
				else c0.diff(new Complexe(0.0, Math.random()+Number.MIN_VALUE));
				this.vari.setValeur(key, c0);
				rep = this.teste(val);
				if(rep == 0) return(false);
				i++;
			} while ((rep<0)&&(i<10));
			
			if(i==10) {
				this.err = "fonction singulière: à reformuler ou à simplifier";
				return(false);
			}
			//retour à valeur initiale
			this.vari.setValeur(key, c00);
		}	
		return(true);
	}
	
	//teste si expression this et expression val ont même forme canonique
    //exemple y=...., ....=y et y=.... ont même forme
    canoniqueA(val) {
    	let i;
    	let variable = new String();
    	i = this.texte.indexOf('=');
    	if (i==-1) {
    		this.err = "pas de signe égal dans l'expression";
    		return(false);
    	}
    	if(i<=(this.texte.length/2)) variable = this.texte.substring(0, i);
    	else variable = this.texte.substring(i+1, this.texte.length);
    	return(val.texte.startsWith(variable+"=")||val.texte.endsWith("="+variable));
    }
}

/************************************************************************/
/******** classe editeur d'expresion mathématique permettant ************/
/******** de comparer la saisie de deux formules ************************/
/************************************************************************/
class Edit {
    constructor() {
        this.bool = false;
        this.erreur = '';
        this.reference = null;  //Expression
        this.reponse = null;	//Expression
    }

	//initialise l'expression reference avec la chaine exp
	// attention, elle doit être de la forme variable = le reste
    initReference(exp) {
        if (exp != null) {
            this.reference = new Expression(exp);
        } else {
            this.reference.err = 'chaine nulle';
        }
        if (this.reference.err.length > 0) {
            this.erreur = this.reference.err;
            return false;
        }
        this.erreur = '';
        return true;
    }

	//initialise l'expression reponse avec la chaine exp
    initReponse(exp) {
        if (exp != null) {
            this.reponse = new Expression(exp);
        } else {
            this.reponse.err = 'chaine nulle';
        }
        if (this.reponse.err.length > 0) {
            this.erreur = this.reponse.err;
            return false;
        }
        this.erreur = '';
        return true;
    }

	//compare reference et réponse sans soucis de la forme exacte
    compare() {
		const test = this.reference.compareA(this.reponse);
		this.erreur = this.reference.err;
        return test;
    }

	//compare reference et réponse et vérifie si la forme est exacte
    canon() {
        if (!this.compare()) {
            return false;
        }

        if (!this.reference.canoniqueA(this.reponse)) {
            if (this.reference.err.length > 0) {
                this.erreur = this.reponse.err;
                return false;
            }
            this.erreur = 'forme correcte mais non conforme à la question';
            return false;
        }
        this.erreur = '';
        return true;
    }

	//renvoie l'erreur
    getErreur() {
        return this.erreur;
    }
}

//initialise variable globale Editeur
let Editeur = new Edit();

//*************************************************************************
//******** initialise expression de référence symbolique ******************
//******** reçoit exp chaine de caractère
//*************************************************************************

function traiteExpRef(exp) 
{ 

	//var bool = document.Editeur.initReference(exp);
	var bool = Editeur.initReference(exp);

	if (!bool)
	{ 
		var err = Editeur.getErreur();
		alert("référence "+err);
	}
} 
////////////////////////////////////////////////////////////////////////////////////////
//*************************************************************************
//******** compare forme canonique de exp avec  ***************************
//******** la réponse venant du formulaire form ***************************
//******** reçoit form formulaire et exp chaine de caractère
//*************       et bouton == nom bouton formulaire
//*************************************************************************
 
function ReponseCanonique(form, exp, bouton) 
{ 
	traiteExpRef(exp);

   	var rep = form.value;
   	
   	if (rep == "")
	{
		alert("Il n'y a pas de réponse");
		bouton.value="Valider";
		return(false);
	}
	
	var bool = Editeur.initReponse(rep);
	if (!bool)
	{ 
		var err = Editeur.getErreur();
		alert(err);
		bouton.value="  faux  ";
		return(false);
	}


	if ( Editeur.canon() )
	{ 
		alert("OK ! Bonne r\351ponse !");
		bouton.value=" juste ";
		return(true);
	}
	else
	{ 
		var err = Editeur.getErreur();
		alert("Mauvaise r\351ponse ! "+err);
		bouton.value="  faux  ";
		return(false);
	}	
	
} 
//*************************************************************************
//******** compare forme canonique de exp avec  ***************************
//******** la réponse venant du formulaire form ***************************
//******** reçoit form formulaire et exp chaine de caractère
//*************        bouton == bouton formulaire
//********        mes url message de réponse
//********		  compteur == objet de comptage avant d'envoyer le message
//*************************************************************************
 
function ReponseCanonique_mes(form, exp, bouton, mes, compteur) 
{ 
	traiteExpRef(exp);

   	var rep = form.value;
   	
   	if (rep == "")
	{
		alert("Il n'y a pas de réponse");
		bouton.value="Valider";
		return(false);
	}
	
	var bool = Editeur.initReponse(rep);
	if (!bool)
	{ 
		var err = Editeur.getErreur();
		alert(err);
		bouton.value="  faux  ";
		return(false);
	}


	if ( Editeur.canon() )
	{ 
		alert("OK ! Bonne r\351ponse !");
		bouton.value=" juste ";
		return(true);
	}
	else
	if (compteur.iter > 0)
	{ 
		var err = Editeur.getErreur();
		
		alert("Mauvaise r\351ponse ! "+err);
		if ((err == "variables suspectes dans l'expression") || (err == "")) compteur.iter--;
		bouton.value="  faux  ";
		return(false);
	}
	else 
	{
				afficher_message(mes);
				bouton.value="  faux  ";
				return(false);
	}	
	
} 
//*************************************************************************
//******** compare forme canonique de exp avec  ***************************
//******** la réponse venant du formulaire form ***************************
//******** reçoit form formulaire et exp chaine de caractère
//*************        bouton == bouton formulaire
//********        mes url message de réponse juste
//*************************************************************************

function ReponseCanonique_mes_juste(form, exp, bouton, mes)
{
	traiteExpRef(exp);

   	var rep = form.value;
   	
   	if (rep == "")
	{
		alert("Il n'y a pas de réponse");
		bouton.value="Valider";
		return(false);
	}
	
	var bool = Editeur.initReponse(rep);
	if (!bool)
	{
		var err = Editeur.getErreur();
		alert(err);
		bouton.value="  faux  ";
		return(false);
	}


	if ( Editeur.canon() )
	{
		afficher_message(mes);//alert("OK ! Bonne réponse !");
		bouton.value=" juste ";
		return(true);
	}
	else
	{
		var err = Editeur.getErreur();
		
		alert("Mauvaise r\351ponse ! "+err);
		if ((err == "variables suspectes dans l'expression") || (err == ""));
		bouton.value="  faux  ";
		return(false);
	}
}
//*************************************************************************
//******** compare forme de exp avec            ***************************
//******** la réponse venant du formulaire form ***************************
//******** reçoit form formulaire et exp chaine de caractère
//******** bouton == bouton formulaire
//*************************************************************************
 
function ReponseEquivalence(form, exp, bouton) 
{ 
	traiteExpRef(exp);

   	var rep = form.value;
   	
   	if (rep == "")
	{
		alert("Il n'y a pas de réponse");
		bouton.value="Valider";
		return(false);
	}
	
	var bool = Editeur.initReponse(rep);
	if (!bool)
	{ 
		var err = Editeur.getErreur();
		alert(err);
		bouton.value="  faux  ";
		return(false);
	}


	if ( Editeur.compare() )
	{ 
		alert("OK ! Bonne r\351ponse !");
		bouton.value=" juste ";
		return(true);
	}
	else
	{ 
		var err = Editeur.getErreur();
		alert("Mauvaise r\351ponse ! "+err);
		bouton.value="  faux  ";
		return(false);
	}	
	
} 
//*************************************************************************
//******** compare forme de exp avec            ***************************
//******** la réponse venant du formulaire form ***************************
//******** reçoit form formulaire et exp chaine de caractère
//********        mes url message de réponse
//********		  compteur == objet de comptage avant d'envoyer le message
//*************************************************************************
 
function ReponseEquivalence_mes(form, exp, bouton, mes, compteur) 
{ 
	traiteExpRef(exp);

   	var rep = form.value;
   	
   	if (rep == "")
	{
		alert("Il n'y a pas de réponse");
		bouton.value="Valider";
		return(false);
	}
	
	var bool = Editeur.initReponse(rep);
	if (!bool)
	{ 
		var err = Editeur.getErreur();
		alert(err);
		bouton.value="  faux  ";
		return(false);
	}


	if ( Editeur.compare() )
	{ 
		alert("OK ! Bonne r\351ponse !");
		bouton.value=" juste ";
		return(true);
	}
	 else
	if (compteur.iter > 0)
	{ 
		var err = Editeur.getErreur();
		
		alert("Mauvaise r\351ponse ! "+err);
		if ((err == "variables suspectes dans l'expression") || (err == "")) compteur.iter--;
		bouton.value="  faux  ";
		return(false);
	}
	else 
	{
				afficher_message(mes);
				bouton.value="  faux  ";
				return(false);
	}
}
//*************************************************************************
//******** compare forme de exp avec            ***************************
//******** la réponse venant du formulaire form ***************************
//******** reçoit form formulaire et exp chaine de caractère
//********        mes url message de réponse juste
//*************************************************************************

function ReponseEquivalence_mes_juste(form, exp, bouton, mes)
{
	traiteExpRef(exp);

   	var rep = form.value;
   	
   	if (rep == "")
	{
		alert("Il n'y a pas de réponse");
		bouton.value="Valider";
		return(false);
	}
	
	var bool = Editeur.initReponse(rep);
	if (!bool)
	{
		var err = Editeur.getErreur();
		alert(err);
		bouton.value="  faux  ";
		return(false);
	}


	if ( Editeur.compare() )
	{
		afficher_message(mes);//alert("OK ! Bonne réponse !");
		bouton.value=" juste ";
		return(true);
	}
	 else
	{
		var err = Editeur.getErreur();
		
		alert("Mauvaise r\351ponse ! "+err);

		bouton.value="  faux  ";
		return(false);
	}
}

//*************************************************************************
//******** teste équivalence    *******************************************
//******** formulaire num       *******************************************
//******** reçoit num numéro du formulaire
//*************************************************************************
function F_Equivalence(num) 
{
  if (num < 0) num = 0; 
  document.write('<center><table BORDER=0 WIDTH=75%>');
  
  document.write('<form name=exp'+num+' ');
  document.write('OnSubmit=boolpage['+num+']=ReponseEquivalence(exp'+num+'[0],reponseFormelle'+num+',bouton'+num+'[0]);vu_metre();return(false);>');
  document.write('<tr><td ALIGN=CENTER>');
  document.write('<input TYPE=text Value="" SIZE=30 MAXLENGTH=40 ></td></tr>');
  document.write('</form>');
     
  document.write('<tr><td align=right><form name=bouton'+num+'>');
  document.write('<input TYPE=button Value=Valider onclick=boolpage['+num+']=ReponseEquivalence(exp'+num+'[0],reponseFormelle'+num+',bouton'+num+'[0]);vu_metre();return(false);>');
  document.write('</form></td></tr></table></center>')

}
//*************************************************************************
//******** teste équivalence    *******************************************
//******** formulaire num       *******************************************
//******** reçoit num numéro du formulaire
//********        mes url message de réponse
//********		  nbre_test == nombre de test avant affichage message
//********		  compteur == objet de comptage avant d'envoyer le message
//*************************************************************************
function F_Equivalence_mes(num, mes, nbre_test) 
{
  if (num < 0) num = 0; 
  document.write('<SCR'+'IPT>');
  document.write('var compteur'+num+' = new Object;');
  document.write('compteur'+num+'.iter = '+nbre_test+';');
  document.write('</SCR'+'IPT>');
  
  
  
  document.write('<center><table BORDER=0 WIDTH=75%>');
  document.write('<form name=exp'+num+' ');
  document.write('OnSubmit=boolpage['+num+']=ReponseEquivalence_mes(exp'+num+'[0],reponseFormelle'+num+',bouton'+num+'[0],"'+mes+'",compteur'+num+');vu_metre();return(false);>');
  document.write('<tr><td ALIGN=CENTER>');
  document.write('<input TYPE=text Value="" SIZE=30 MAXLENGTH=40 ></td></tr>');
  document.write('</form>');
  document.write('<tr><td align=right><form name=bouton'+num+'>');
  document.write('<input TYPE=button Value=Valider onclick=boolpage['+num+']=ReponseEquivalence_mes(exp'+num+'[0],reponseFormelle'+num+',bouton'+num+'[0],"'+mes+'",compteur'+num+');vu_metre();return(false);>');
  document.write('</form></td></tr></table></center>')

}
//*************************************************************************
//******** teste équivalence    *******************************************
//******** formulaire num       *******************************************
//******** reçoit num numéro du formulaire
//********        mes url message de réponse juste
//*************************************************************************
function F_Equivalence_mes_juste(num, mes)
{
  if (num < 0) num = 0;
  
  document.write('<center><table BORDER=0 WIDTH=75%>');
  document.write('<form name=exp'+num+' ');
  document.write('OnSubmit=boolpage['+num+']=ReponseEquivalence_mes_juste(exp'+num+'[0],reponseFormelle'+num+',bouton'+num+'[0],"'+mes+'");vu_metre();return(false);>');
  document.write('<tr><td ALIGN=CENTER>');
  document.write('<input TYPE=text Value="" SIZE=30 MAXLENGTH=40 ></td></tr>');
  document.write('</form>');
  document.write('<tr><td align=right><form name=bouton'+num+'>');
  document.write('<input TYPE=button Value=Valider onclick=boolpage['+num+']=ReponseEquivalence_mes_juste(exp'+num+'[0],reponseFormelle'+num+',bouton'+num+'[0],"'+mes+'");vu_metre();return(false);>');
  document.write('</form></td></tr></table></center>')

}
//*************************************************************************
//******** teste canonique    *******************************************
//******** formulaire num       *******************************************
//******** reçoit num numéro du formulaire
//*************************************************************************
function F_Canonique(num) 
{
  if (num < 0) num = 0; 
  document.write('<center><table BORDER=0 WIDTH=75%>');
  
  document.write('<form name=exp'+num+' ');
  document.write('OnSubmit=boolpage['+num+']=ReponseCanonique(exp'+num+'[0],reponseFormelle'+num+',bouton'+num+'[0]);vu_metre();return(false);>');
  document.write('<tr><td ALIGN=CENTER>');
  document.write('<input TYPE=text Value="" SIZE=30 MAXLENGTH=40 ></td></tr>');
  document.write('</form>');
     
  document.write('<tr><td align=right><form name=bouton'+num+'>');
  document.write('<input TYPE=button Value=Valider onclick=boolpage['+num+']=ReponseCanonique(exp'+num+'[0],reponseFormelle'+num+',bouton'+num+'[0]);vu_metre();return(false);>');
  document.write('</form></td></tr></table></center>')
  
}

//*************************************************************************
//******** teste canonique    *******************************************
//******** formulaire num       *******************************************
//******** reçoit num numéro du formulaire
//********        mes url message de réponse
//********		  nbre_test == nombre de test avant affichage message
//*************************************************************************
function F_Canonique_mes(num, mes, nbre_test) 
{
  if (num < 0) num = 0; 
  document.write('<SCR'+'IPT>');
  document.write('var compteur'+num+' = new Object;');
  document.write('compteur'+num+'.iter = '+nbre_test+';');
  document.write('</SCR'+'IPT>');
  
  
  
  document.write('<center><table BORDER=0 WIDTH=75%>');
  document.write('<form name=exp'+num+' ');
  document.write('OnSubmit=boolpage['+num+']=ReponseCanonique_mes(exp'+num+'[0],reponseFormelle'+num+',bouton'+num+'[0],"'+mes+'",compteur'+num+');vu_metre();return(false);>');
  document.write('<tr><td ALIGN=CENTER>');
  document.write('<input TYPE=text Value="" SIZE=30 MAXLENGTH=40 ></td></tr>');
  document.write('</form>');
  document.write('<tr><td align=right><form name=bouton'+num+'>');
  document.write('<input TYPE=button Value=Valider onclick=boolpage['+num+']=ReponseCanonique_mes(exp'+num+'[0],reponseFormelle'+num+',bouton'+num+'[0],"'+mes+'",compteur'+num+');vu_metre();return(false);>');
  document.write('</form></td></tr></table></center>')
  
}
//*************************************************************************
//******** teste canonique    *******************************************
//******** formulaire num       *******************************************
//******** reçoit num numéro du formulaire
//********        mes url message de réponse juste
//*************************************************************************
function F_Canonique_mes_juste(num, mes)
{
  if (num < 0) num = 0;

  document.write('<center><table BORDER=0 WIDTH=75%>');
  document.write('<form name=exp'+num+' ');
  document.write('OnSubmit=boolpage['+num+']=ReponseCanonique_mes_juste(exp'+num+'[0],reponseFormelle'+num+',bouton'+num+'[0],"'+mes+'");vu_metre();return(false);>');
  document.write('<tr><td ALIGN=CENTER>');
  document.write('<input TYPE=text Value="" SIZE=30 MAXLENGTH=40 ></td></tr>');
  document.write('</form>');
  document.write('<tr><td align=right><form name=bouton'+num+'>');
  document.write('<input TYPE=button Value=Valider onclick=boolpage['+num+']=ReponseCanonique_mes_juste(exp'+num+'[0],reponseFormelle'+num+',bouton'+num+'[0],"'+mes+'");vu_metre();return(false);>');
  document.write('</form></td></tr></table></center>')

}
//********* formulation courte
//*************************************************************************
//******** formulaire QCM (exposé à l'horizontale) *************************
//******** reçoit num numéro du formulaire
//********        on suppose alternatives'num'
//*************************************************************************
function Q_H(num)
{
	document.write('<SCR'+'IPT>');
	document.write('qcmh('+num+', alternatives'+num+');');
	document.write('</SCR'+'IPT>');
}

//*************************************************************************
//******** formulaire QCM (exposé à la verticale) *************************
//******** reçoit num numéro du formulaire
//********        on suppose alternatives'num'
//*************************************************************************
function Q_V(num)
{
	document.write('<SCR'+'IPT>');
	document.write('qcmv('+num+', alternatives'+num+');');
	document.write('</SCR'+'IPT>');
}
//*************************************************************************
//******** formulaire QCM (exposé à l'horizontale) *************************
//******** reçoit num numéro du formulaire
//********        on suppose alternatives'num, chemin_message'num
//******** 		  nbre_test == 2
//*************************************************************************
function Q_H_M(num)
{
	document.write('<SCR'+'IPT>');
	document.write('qcmh_mes('+num+', alternatives'+num+', chemin_message'+num+', 2);');
	document.write('</SCR'+'IPT>');
}
//*************************************************************************
//******** formulaire QCM (exposé à l'horizontale) *************************
//******** retourne message si reponse juste
//******** reçoit num numéro du formulaire
//********        on suppose alternatives'num, chemin_message'num
//*************************************************************************
function Q_H_M_J(num)
{
	document.write('<SCR'+'IPT>');
	document.write('qcmh_mes_juste('+num+', alternatives'+num+', chemin_message'+num+');');
	document.write('</SCR'+'IPT>');
}
//*************************************************************************
//******** formulaire QCM (exposé à la verticale) *************************
//******** reçoit num numéro du formulaire
//********        on suppose alternatives'num, chemin_message'num
//******** 		  nbre_test == 2
//*************************************************************************
function Q_V_M(num)
{
	document.write('<SCR'+'IPT>');
	document.write('qcmv_mes('+num+', alternatives'+num+', chemin_message'+num+', 2);');
	document.write('</SCR'+'IPT>');
}

//*************************************************************************
//******** formulaire QCM (exposé à la verticale) *************************
//******** retourne message si reponse juste
//******** reçoit num numéro du formulaire
//********        on suppose alternatives'num, chemin_message'num
//*************************************************************************
function Q_V_M_J(num)
{
	document.write('<SCR'+'IPT>');
	document.write('qcmv_mes_juste('+num+', alternatives'+num+', chemin_message'+num+');');
	document.write('</SCR'+'IPT>');
}

//*************************************************************************
//******** formulaire num *************************************************
//******** reçoit num numéro du formulaire
//********        text texte à afficher devant boite
//*************************************************************************
function N(num, text) 
{
	numeric(num,text);
}

//*************************************************************************
//******** formulaire num *************************************************
//******** reçoit num numéro du formulaire
//********        text texte à afficher devant boite
//********        on suppose chemin_message'num' et nbre_test = 2
//*************************************************************************
function N_M(num, text) 
{
	document.write('<SCR'+'IPT>');
	document.write('numeric_mes('+num+', chemin_message'+num+', 2, "'+text+'");');
	document.write('</SCR'+'IPT>');
	
}

//*************************************************************************
//******** formulaire num *************************************************
//******** retourne message si reponse juste
//******** reçoit num numéro du formulaire
//********        text texte à afficher devant boite
//*************************************************************************
function N_M_J(num, text)
{
	document.write('<SCR'+'IPT>');
	document.write('numeric_mes_juste('+num+', chemin_message'+num+', "'+text+'");');
	document.write('</SCR'+'IPT>');
	
}

//*************************************************************************
//******** test canonique sans message  ***********************************
//******** formulaire num       *******************************************
//*************************************************************************
function F_E(num) 
{
	F_Equivalence(num); 

}
//*************************************************************************
//******** test equivalence    *******************************************
//******** formulaire num       *******************************************
//******** reçoit num numéro du formulaire
//********        on suppose reponseFormelle'num', chemin_message'num', nbre_test == 2
//*************************************************************************
function F_E_M(num, url_message) 
{
	document.write('<SCR'+'IPT>');
	document.write('F_Equivalence_mes('+num+', chemin_message'+num+', 2);');
	document.write('</SCR'+'IPT>');
}
//*************************************************************************
//******** test equivalence    *******************************************
//******** retourne message si reponse juste
//******** formulaire num       *******************************************
//******** reçoit num numéro du formulaire
//*************************************************************************
function F_E_M_J(num, url_message)
{
	document.write('<SCR'+'IPT>');
	document.write('F_Equivalence_mes_juste('+num+', chemin_message'+num+');');
	document.write('</SCR'+'IPT>');
}
//*************************************************************************
//******** test canonique sans message  ***********************************
//******** formulaire num       *******************************************
//*************************************************************************
function F_C(num) 
{
	F_Canonique(num); 

}

//*************************************************************************
//******** teste canonique    *******************************************
//******** formulaire num       *******************************************
//******** reçoit num numéro du formulaire
//********        on suppose reponseFormelle'num', chemin_message'num', nbre_test == 2
//*************************************************************************
function F_C_M(num) 
{
	document.write('<SCR'+'IPT>');
	document.write('F_Canonique_mes('+num+', chemin_message'+num+', 2);');
	document.write('</SCR'+'IPT>');

}
//*************************************************************************
//******** teste canonique    *******************************************
//******** retourne message si reponse juste
//******** formulaire num       *******************************************
//******** reçoit num numéro du formulaire
//********        on suppose reponseFormelle'num', chemin_message'num'
//*************************************************************************
function F_C_M_J(num)
{
	document.write('<SCR'+'IPT>');
	document.write('F_Canonique_mes_juste('+num+', chemin_message'+num+');');
	document.write('</SCR'+'IPT>');

}
