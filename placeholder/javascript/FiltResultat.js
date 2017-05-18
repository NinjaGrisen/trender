// ****************************************************************************************************
// Visar sökresultatet
// @MyList    -> Lista med objekt utifrån sökresultatet, se separat dokument för beskrivning
// @page      -> Aktuelll sida i sökresultatet
// @elPerPage -> Antal objekt per sida 
//
// Gruppfunktioner är inte implementerade hela vägen än, men påbörjat
//
// Funktionsanrop
// - startSpinner / stopSpinner -> Startar och stoppar "arbetar"-snurran
// - GetWebText -> Hämtar längre texter, normalt olika typer av beskrivningar
// - FilterWebLanguage -> Hämtar ledtexter
//
//  Variabelbeskrivning
// - MyFilter -> styrning för vad som ska visas, se separat dokument
// ****************************************************************************************************

function printObjects(MyList, page, elPerPage) {

    if (!page) {
        page = 1;
    }
    page = (typeof (page) !== "undefined" && page !== null) ? page : 1;
    elPerPage = (typeof (elPerPage) !== "undefined" && elPerPage !== null) ? elPerPage : itemsPerPage;

    var firstElement = (page - 1) * elPerPage;
    var lastElement = (page) * elPerPage;

    startSpinner("");

    var objectList = '';
    if (MyList.length === 0) {
        var t = GetWebText("Inga träffar");
    }

    var ReadMore = FilterWebLanguage("Läs mer");
    var ShowMore = FilterWebLanguage("VisaGrupp");//"Visa/dölj gruppobjekt";
    var BildRubrik = FilterWebLanguage("Bilder");
    var group = false;
    var firstInGroup = true;
    var groupObjectId = "";
    for (var i = firstElement; i < MyList.length && i < lastElement; i++) {
        var ordbadd = MyList[i].OrdBeds;
        var exbadd = MyList[i].ExBeds;
        var kapacitet = ordbadd + exbadd;
        var stars = '';
        for (x = 0; x < MyList[i].ObjectClassNr; x++) {
            stars += '&#9733;';
        }

        var objectId = '';
        var objectId = MyList[i].ObjectNr;

        objectIdArray.push(objectId);

        var dateString = "6/7/2014:6/14/2014:4,7-7,7-7,4:3!6/7/2015:6/14/2015:4,7-7,7-7,4:3";
        if (group && !MyList[i].partOfGroup) {
            //Slut av grupp
            objectList += "</ul></li>";
            group = false;
            firstInGroup = true;
        }
        if (MyList[i].parentOfGroup) {
            group = true;
        }
        if (MyList[i].partOfGroup) {
            if (firstInGroup) {
                objectList += '<ul class="group">';
                firstInGroup = false;
            }
            objectList += '<li class="groupobject hiddenx ' + MyList[i].ObjecttypeID3 + ' ' + MyList[i].backgroundCSS + ' " objektnr="' + MyList[i].ObjectNr + '" objektnamn="' + MyList[i].SortObjectName + MyList[i].ObjectName + '" pris="' + MyList[i].SortObjectName + MyList[i].Price + '" objektkategorinr="' + MyList[i].SortObjectName + MyList[i].ObjectClassNr + '" kapacitet="' + MyList[i].SortObjectName + kapacitet + '" defaultSort="' + MyList[i].SortObjectName + MyList[i].defaultSort + '">';

        } else {
            objectList += '<li class="object ' + MyList[i].backgroundCSS + ' " data-objektnr="' + MyList[i].ObjectNr + '" data-objektnamn="' + MyList[i].ObjectName + '" data-pris="' + MyList[i].Price + '" data-objektkategorinr="' + MyList[i].ObjectClassNr + '" data-kapacitet="' + kapacitet + '" data-defaultSort="' + MyList[i].defaultSort + '" >';
        }
        if (!MyList[i].Gallery) {
            var gallery = '';
        }
        else {
            var gallery = MyList[i].Gallery;
            gallery.toString();
        };

        if (!MyList[i].KeyWords) {
            var keywords = '';
        }
        else {
            var keywords = MyList[i].KeyWords;
        };

        var words = [];
        if (keywords.indexOf("|")) {
            keywords = keywords.split(";");
            for (c = 0; c < keywords.length - 1; c++) {
                var word = keywords[c].split("|");
                words.push(word[1]);
            }
            keywords = words;
        }





        // ******************************** SÖKRESULTAT ***********************************************************************

        //Slår på/av Objektnr, Objektnamn & klass.
        //Får vi inget data vid filtrering skrivs allt ut.

        var objTypId = _objTypId == 105 ? 105 : 101;
        var MyAccType = [];
        if ($("#inputAccomodationType").val()) {
            MyAccType = $("#inputAccomodationType").val().split("|");
        }

        if (MyAccType.length > 1) {
            var acctype = MyAccType[1] === "0" ? objTypId : MyAccType[1];
            var MyFilter = Enumerable.From(MyWebCtl).Where("$.ObjektTypId === " + acctype + "  && $.ModulStyr === 'logiSok'").ToArray();
            var MyGroupFilter = Enumerable.From(MyWebCtl).Where("$.ObjektTypId === " + acctype + "  && $.ModulStyr === 'logiSokGr'").ToArray();
        }
        else {
            var MyFilter = Enumerable.From(MyWebCtl).Where("$.ObjektTypId === " + objTypId + "  && $.ModulStyr === 'logiSok'").ToArray();
            var MyGroupFilter = Enumerable.From(MyWebCtl).Where("$.ObjektTypId === " + objTypId + "  && $.ModulStyr === 'logiSokGr'").ToArray();
        }

        if (MyFilter.length > 0) {
            var p = imagePath + "/";
            if ((!MyList[i].parentOfGroup && MyFilter[0].Bild === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].Bild === 1)) {
                if (MyList[i].Gallery.length > 0) {
                    if (MyList[i].Gallery.substring(0, 7) == 'http://') {
                        p = "";
                    }
                    var bild = encodeURI(MyList[i].Gallery.replace("ImageSize=Original", "ImageSize=Small"));
                    objectList += '<div class="row"><div class="col-sm-2"><span class="col_short"><img alt="bild" class="lazy thumbnail img-responsive" width="375" height="212" data-original="' + p + bild + '"  src="' + p + bild + '"/></span></div>';
                } else {
                    objectList += '<div class="row"><div class="col-sm-2"><span class="col_short"><img alt="bild" src="' + '' + '../img/icons/bild_finns_ej.jpg" class="img-responsive thumbnail" /></span></div>'; //TODO: ska väl bort enligt filter
                }
            }
        } else {
            if (MyList[i].Gallery.length > 0) {
                objectList += '<div class="row"><div class="col-sm-2"><span class="col_short"><img alt="bild" class="lazy thumbnail img-responsive" width="375" height="212" src="' + path + '/images/lazy.png" data-original="' + imagePath + "/" + encodeURI(MyList[i].Gallery) + '" /></span></div>';
            } else {
                objectList += '<div class="row"><div class="col-sm-2"><span class="col_short"><img alt="bild" src="' + '' + '../img/icons/bild_finns_ej.jpg" class="img-responsive thumbnail" /></span></div>';
            }
        }

        var objectDelimiter = " "; // ", " //Fixa styrning
        if (MyFilter.length > 0) {
            if ((!MyList[i].parentOfGroup && MyFilter[0].ObjektNr === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].ObjektNr === 1)) {
                objectList += '<div class="col-sm-7"><div class="row"><div class="col-sm-12 objectHeader"><span class="objectNrStyle">' + MyList[i].ObjectNr + '</span>';
            }
            if ((!MyList[i].parentOfGroup && MyFilter[0].ObjektNamn === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].ObjektNamn === 1)) {
                if (MyFilter[0].ObjektNr === 1) {
                    objectList += objectDelimiter + MyList[i].ObjectName;
                }
                else {
                    objectList += '<div class="col-sm-7"><div class="row"><div class="col-sm-12 objectHeader">' + MyList[i].ObjectName;
                }
            }


            if ((!MyList[i].parentOfGroup && MyFilter[0].Klass === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].Klass === 1)) {
                objectList += ' ' + stars + '</div></div>'
            }
            else {
                objectList += '</div></div>'
            }
        }
        else {
            objectList += '<div class="col-sm-7"><div class="row"><div class="col-sm-12 objectHeader">' + MyList[i].ObjectNr + objectDelimiter + MyList[i].ObjectName + ' ' + stars + '</div></div>';
        }

        var accomodationString = '';

        if (MyList[i].AccommodationType || MyList[i].AccommodationForm) {
            if (MyFilter.length > 0) {

                if ((!MyList[i].parentOfGroup && (MyFilter[0].ObjektTyp2 === 1 || MyFilter[0].ObjektTyp3 === 1 || MyFilter[0].Kapacitet === 1)) || (MyList[i].parentOfGroup && (MyGroupFilter[0].ObjektTyp2 === 1 || MyGroupFilter[0].ObjektTyp3 === 1 || MyGroupFilter[0].Kapacitet === 1))) {

                    if (MyFilter[0].ObjektTyp2 === 1 || MyFilter[0].ObjektTyp3 === 1) {
                        accomodationString = '<img src="../img/icons/house.png" alt="house"/> ';
                    }

                    if (MyList[i].AccommodationForm) {

                        if ((!MyList[i].parentOfGroup && MyFilter[0].ObjektTyp2 === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].ObjektTyp2 === 1)) {
                            accomodationString += MyList[i].AccommodationForm;
                        }
                    }
                    if (MyList[i].AccommodationType) {

                        if ((!MyList[i].parentOfGroup && MyFilter[0].ObjektTyp3 === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].ObjektTyp3 === 1)) {

                            if ((!MyList[i].parentOfGroup && MyFilter[0].ObjektTyp2 === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].ObjektTyp2 === 1)) {
                                accomodationString += ', ' + MyList[i].AccommodationType;
                            }
                            else {
                                accomodationString += MyList[i].AccommodationType;
                            }
                        }
                    }
                }
            }
            else {

                accomodationString = '<img src="../img/icons/house.png" alt="house"/> ';


                if (MyList[i].AccommodationForm) {
                    accomodationString += MyList[i].AccommodationForm;
                }
                if (MyList[i].AccommodationType) {
                    accomodationString += ', ' + MyList[i].AccommodationType;
                }
            }
        }

        var geoString = "";
        var GeoImage = "";

        if (MyList[i].Facility || MyList[i].Area) {
            //Avdelning.
            if (MyList[i].Department) {
                if (MyFilter.length > 0) {
                    if ((!MyList[i].parentOfGroup && MyFilter[0].Avdelning === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].Avdelning === 1)) {
                        if (MyList[i].Department != "Odefinierat" && MyList[i].Department != "Odefinierad") {
                            geoString += MyList[i].Department;
                        }
                    }
                }
                else {
                    if (MyList[i].Department != "Odefinierat" && MyList[i].Department != "Odefinierad") {
                        geoString += MyList[i].Department;
                    }
                }
            }

            //Land.
            if (MyList[i].CountryCode) {
                if (MyFilter.length > 0) {
                    if ((!MyList[i].parentOfGroup && MyFilter[0].Land === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].Land === 1)) {
                        if ((!MyList[i].parentOfGroup && MyFilter[0].Avdelning === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].Avdelning === 1)) {
                            geoString += ", " + MyList[i].CountryCode;
                        }
                        else {
                            geoString += MyList[i].CountryCode;
                        }
                    }
                }
                else {
                    geoString += ", " + MyList[i].CountryCode;
                }
            }

            //Län.
            if (MyList[i].County) {
                if (MyFilter.length > 0) {
                    if ((!MyList[i].parentOfGroup && MyFilter[0].Lan === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].Lan === 1)) {
                        if ((!MyList[i].parentOfGroup && (MyFilter[0].Avdelning === 1 || MyFilter[0].Land === 1)) || (MyList[i].parentOfGroup && (MyGroupFilter[0].Avdelning === 1 || MyGroupFilter[0].Land === 1))) {
                            geoString += ", " + MyList[i].County;
                        }
                        else {
                            geoString += MyList[i].County;
                        }
                    }
                }
                else {
                    geoString += ", " + MyList[i].County;
                }
            }

            //Kommun.
            if (MyList[i].Commune) {
                if (MyFilter.length > 0) {
                    if ((!MyList[i].parentOfGroup && MyFilter[0].Kommun === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].Kommun === 1)) {
                        if ((!MyList[i].parentOfGroup && (MyFilter[0].Avdelning === 1 || MyFilter[0].Land === 1 || MyFilter[0].Lan === 1)) || (MyList[i].parentOfGroup && (MyGroupFilter[0].Avdelning === 1 || MyGroupFilter[0].Land === 1 || MyGroupFilter[0].Lan === 1))) {
                            geoString += ", " + MyList[i].Commune;
                        }
                        else {
                            geoString += MyList[i].Commune;
                        }
                    }
                }
                else {
                    geoString += ", " + MyList[i].Commune;
                }
            }

            //Område.
            if (MyList[i].Area) {
                if (MyFilter.length > 0) {
                    if ((!MyList[i].parentOfGroup && MyFilter[0].Omrade === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].Omrade === 1)) {
                        if ((!MyList[i].parentOfGroup && (MyFilter[0].Avdelning === 1 || MyFilter[0].Land === 1 || MyFilter[0].Lan === 1 || MyFilter[0].Kommun === 1)) || (MyList[i].parentOfGroup && (MyGroupFilter[0].Avdelning === 1 || MyGroupFilter[0].Land === 1 || MyGroupFilter[0].Lan === 1 || MyGroupFilter[0].Kommun === 1))) {
                            geoString += ', ' + MyList[i].Area;
                        }
                        else {
                            geoString += MyList[i].Area;
                        }
                    }
                }
                else {
                    geoString += ', ' + MyList[i].Area;
                }
            }

            //Anläggning.
            if (MyList[i].Facility) {
                if (MyFilter.length > 0) {
                    if ((!MyList[i].parentOfGroup && MyFilter[0].Anlaggning === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].Anlaggning === 1)) {
                        if ((!MyList[i].parentOfGroup && (MyFilter[0].Avdelning === 1 || MyFilter[0].Land === 1 || MyFilter[0].Lan === 1 || MyFilter[0].Kommun === 1 || MyFilter[0].Omrade === 1)) || (MyList[i].parentOfGroup && (MyGroupFilter[0].Avdelning === 1 || MyGroupFilter[0].Land === 1 || MyGroupFilter[0].Lan === 1 || MyGroupFilter[0].Kommun === 1 || MyGroupFilter[0].Omrade === 1))) {
                            if (MyList[i].Facility != "Odefinierat" && MyList[i].Facility != "Odefinierad") {
                                geoString += ', ' + MyList[i].Facility;
                            }
                        }
                        else {
                            if (MyList[i].Facility != "Odefinerat" && MyList[i].Facility != "Odefinierad") {
                                geoString += MyList[i].Facility;
                            }
                        }
                    }
                }
                else {
                    if (MyList[i].Facility != "Odefinerat" && MyList[i].Facility != "Odefinierad") {
                        geoString += ', ' + MyList[i].Facility;
                    }
                }
            }
        }

        if (geoString != "") {
            GeoImage = '<img src="../img/icons/geography.png" alt=""/> ';
        }

        var shortInfoString = '';

        if (MyList[i].Beskrivning1) {
            if (MyFilter.length > 0) {
                if ((!MyList[i].parentOfGroup && MyFilter[0].BeskrKort === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].BeskrKort === 1)) {
                    shortInfoString += MyList[i].Beskrivning1;
                }
            }
            else {
                shortInfoString += MyList[i].Beskrivning1;
            }
        }

        var CapacityString = "";

        if (MyFilter.length > 0) {
            if ((!MyList[i].parentOfGroup && MyFilter[0].Kapacitet === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].Kapacitet === 1)) {
                if (MyList[i].parentOfGroup == true) {
                    if (MyList[i].OrdBeds != MyList[i].ExBeds) {
                        CapacityString = ' <img src="../img/icons/bed.png" alt="nr of beds"/> ' + MyList[i].OrdBeds + " - " + MyList[i].ExBeds;
                    } else {
                        CapacityString = ' <img src="../img/icons/bed.png" alt= "nr of beds"/> ' + MyList[i].OrdBeds;
                    }
                } else {
                    CapacityString = ' <img src="../img/icons/bed.png"  alt= "nr of beds"/> ' + MyList[i].OrdBeds + " + " + MyList[i].ExBeds;
                }
            }
        }
        else {
            if (MyList[i].parentOfGroup == true) {
                if (MyList[i].OrdBeds != MyList[i].ExBeds) {
                    CapacityString = ' <img src="../img/icons/bed.png"  alt= "nr of beds"/> ' + MyList[i].OrdBeds + " - " + MyList[i].ExBeds;
                } else {
                    CapacityString = ' <img src="../img/icons/bed.png" alt= "nr of beds" /> ' + MyList[i].OrdBeds;
                }
            } else {
                CapacityString = ' <img src="../img/icons/bed.png"  alt= "nr of beds"/> ' + MyList[i].OrdBeds + " + " + MyList[i].ExBeds;
            }
        }


        objectList += '<div class="col-sm-12">' + shortInfoString + '</div>';
        objectList += '<div class="col-sm-12">';

        //Ritar upp den nedre navbaren
        if (MyList[i].parentOfGroup != true) {
            objectList += '<div class="row"><div class="col-sm-12">';
            objectList += '<div class="btn-group btn-group-justified" role="group" aria-label="...">';
            objectList += '<a class="btn  btn-default" onclick="toggleInfo(\'' + objectId + '\');" >' + ReadMore + '</a>';
            objectList += '<a class="btn  btn-default imageRotatorBtn" data-objectid="' + objectId + '" data-objectname="' + MyList[i].ObjectName + '" data-toggle="modal" data-target="#pictures" href="#" >' + BildRubrik + '</a>';
            if (MyFilter[0].KartaOversikt === 1) {
                objectList += '<a class="btn  btn-default ovMapBtn" data-objectid="' + objectId + '" data-objectname="' + MyList[i].ObjectName + '" data-toggle="modal"  data-target="#ovMap" href="#" >' + FilterWebLanguage("Översiktskarta") + '</a>';
            }

            objectList += '</div>';
            objectList += '</div>';
            objectList += '</div>';

            //moreinfo
            objectList += '<div class="row">';
            objectList += '<div class="col-sm-12 hiddenx" id="moreinfo' + objectId + '">'; //moreinfo
            objectList += '<div class="row"><div class="col-sm-12">';//<div class="row"><div class="col-sm-12">';
            if (MyFilter.length > 0) {
                if ((!MyList[i].parentOfGroup && MyFilter[0].Beskr1 === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].Beskr1 === 1)) {
                    objectList += '<div class="Objektbeskrivning" id="ObjBeskr1_' + objectId + '"></div>';
                }
                if ((!MyList[i].parentOfGroup && MyFilter[0].Beskr2 === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].Beskr2 === 1)) {
                    objectList += '<div class="Objektbeskrivning" id="ObjBeskr2_' + objectId + '"></div>';
                }
                if ((!MyList[i].parentOfGroup && MyFilter[0].Beskr3 === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].Beskr3 === 1)) {
                    objectList += '<div class="Objektbeskrivning" id="ObjBeskr3_' + objectId + '"></div>';
                }
            }
            else {
                objectList += '<div id="ObjBeskr1_' + objectId + '"></div>';
                objectList += '<div id="ObjBeskr2_' + objectId + '"></div>';
                objectList += '<div id="ObjBeskr3_' + objectId + '"></div>';
            }
            objectList += '</div>';
            objectList += '</div>';
            objectList += '</div>'; //moreinfo
            objectList += '</div>';
        }
        if (MyList[i].parentOfGroup == true) {
            objectList += '<p style="text-align: left"><a class="btn btn-default" onclick="showMore(\'' + MyList[i].ObjecttypeID3 + '\');"  style="width: 300px; font-weight: bold;" name="' + objectId + '" ><span class="glyphicon glyphicon-chevron-down"></span> ' + ShowMore + '</a></p>';
        }
        objectList += '</div>';
        objectList += '</div>';
        objectList += '<div class="col-sm-3">';
        if (MyList[i].parentOfGroup == true) {
            if (0 < MyList[i].Price) {
                if (MyList[i].GrossPrice != MyList[i].Price) {
                    objectList += '<h4 class="objectDiscountPrice" >' + MyList[i].GrossPrice + ' - ' + MyList[i].Price + ' ' + Currency + '</h4>';  //TODO: fixa valuta
                } else {
                    objectList += '<h4 class="objectDiscountPrice" >' + MyList[i].GrossPrice + ' ' + Currency + '</h4>';  //TODO: fixa valuta
                }
            }
        } else {
            if (0 < MyList[i].Price) {
                if (MyList[i].Discount > 0) {
                    objectList += '<h4 class="objectDiscountPrice" >' + MyList[i].Price + ' ' + Currency + '</h4>';  //TODO: fixa valuta
                    objectList += '<h5 class="objectGrossPrice" >' + MyList[i].GrossPrice + ' ' + Currency + '</h5>';  //TODO: fixa valuta
                } else {
                    objectList += '<h4 class="objectPrice">' + MyList[i].Price + ' ' + Currency + '</h4>';
                }
            }
        }
        delimiter = "";
        objectList += '<div class="">' + GeoImage + geoString + '</div>';
        if (accomodationString.length > 0 && CapacityString.length > 0) {
            delimiter = "<br />";
        }

        var forbiddenList = "";
        if (MyList[i].RuleCode == 1) {
            forbiddenList = '<br /><img  src="../img/icons/noSmoke.png" alt="" title="' + FilterWebLanguage("ejRokning") + '"/><p></p>';
        }
        if (MyList[i].RuleCode == 2) {
            forbiddenList = '<br /><img  src="../img/icons/nopet.png"  alt="" title="' + FilterWebLanguage("ejDjur") + '"/><p></p>';
        }
        if (MyList[i].RuleCode == 3) {
            forbiddenList = '<br /><img  src="../img/icons/noSmoke.png" alt="" title="' + FilterWebLanguage("ejRokning") + '"/>';
            forbiddenList += ' <img  src="../img/icons/nopet.png" alt="" title="' + FilterWebLanguage("ejDjur") + '"/><p></p>';
        }

        objectList += '<div class="">' + accomodationString + delimiter + CapacityString + forbiddenList + '</div>';


        objectList += '<div class="hiddenx FacInfo" id="moreinfoFac' + objectId + '">';
        if (keywords.length > 0) {
            var facilitiesString = '';

            for (var g = 0; g < keywords.length; g++) {
                facilitiesString += keywords[g] + ', ';
            }

            facilitiesString = facilitiesString.substring(0, facilitiesString.length - 2);
            if (MyFilter.length > 0) {
                if ((!MyList[i].parentOfGroup && MyFilter[0].Sokord === 1) || (MyList[i].parentOfGroup && MyGroupFilter[0].Sokord === 1)) {
                    objectList += '<b>' + FilterWebLanguage("Faciliteter") + '</b><br /> ';
                    objectList += facilitiesString;
                }
            }
            else {
                objectList += '<b>' + FilterWebLanguage("Faciliteter") + '</b><br /> ';
                objectList += facilitiesString;
            }
        }
        objectList += '</div>'
        objectList += '<div id="searchAvstand_' + objectId + '" class="AvstandInfo hiddenx"></div>';

        if (MyList[i].parentOfGroup == false) {
            objectList += '<a class="btn btn-primary" onclick="showObject(\'' + MyList[i].ObjectNr + '\');">' + FilterWebLanguage("InfoBoka") + '</a>';
        }
        objectList += '</div>';
        objectList += '</div>';

        if (!group) {
            objectList += '</li>';
        }
    }
    if (group) {
        objectList += '</li>';
    }
    $("#tabLogi").animate({
        opacity: 1,
        backgroundColor: "#fff"
    });

    var resultCount = MyList.length;

    $("#objectCount").html(resultCount);
    console.log("lägger ut resultat (506)");
    $("#searchResult").html(objectList);

    setPagination(page);
    $(".hiddenx").hide();
    var objTypId = _objTypId == 105 ? 105 : 101;
    var MyFilter = Enumerable.From(MyWebCtl).Where("$.ObjektTypId === " + objTypId + "  && $.ModulStyr === 'logiFil'").ToArray();
    if (MyFilter[0].LazyLoad === 1) {
        $("img.lazy").lazyload(
            {
                skip_invisible: true
            });
    }
    stopSpinner("");

}

// Visar bildspel i filtreringsresultatet

function loadImageRotator(objektNr, objektNamn) {
    var objTypId = _objTypId == 105 ? 105 : 101;
    var MyFilter = Enumerable.From(MyWebCtl).Where("$.ObjektTypId === " + objTypId + "  && $.ModulStyr === 'logiSok'").ToArray();
    if (MyFilter[0].ObjektNr !== 0) {
        $("#imgModalLabel").html(objektNr + ", " + objektNamn);
    } else {
        $("#imgModalLabel").html(objektNamn);
    }
    var img;
    var imgPath = imagePath + "/";
    var thumbs = "";
    $.ajax({
        url: '../bmLogiFilt/LogiFilt.aspx/getImages',
        data: "{ objektnr: '" + objektNr + "' }",
        contentType: "application/json; charset=utf-8",
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            img = JSON.parse(data.d);
            if (img != null) {
                $("#imgCarouselBigContainer").empty();
                $("#imgCarouselSlideContainer").empty();

                for (i = 0; i < img.length; i++) {
                    var str = '';
                    if (i == 0) {
                        str += '<div class="item active">';
                    } else {
                        str += '<div class="item">';
                    }
                    var alt = img[i].TextBild !== "" ? img[i].TextBild : "Bild " + i;
                    var p = imgPath;
                    if (img[i].BildNamn.substring(0, 7) == 'http://') {
                        p = "";
                    }

                    str += '<img src="' + p + img[i].BildNamn + '" alt="' + alt + '" title="' + alt + '" />';
                    str += '</div>';
                    $("#imgCarouselBigContainer").append(str);
                }

                var leftSlide = '';
                leftSlide += '<div class="col-xs-2 col-sm-2">';
                leftSlide += '<div class="btn imageRotatorButton hiddenx prev-slide" onclick="slideLeft(\'imgCarousel\')">';
                leftSlide += '<i class="fa fa-caret-left fa-2x"></i>';
                leftSlide += '</div>';
                leftSlide += '</div>';
                $("#imgCarouselSlideContainer").append(leftSlide);

                for (i = 0; i < img.length; i++) {
                    var str = '';
                    if (i > 3) {
                        str += '<div class="col-xs-2 col-sm-2 thumbs imgCarousel hiddenx">';
                    } else {
                        str += '<div class="col-xs-2 col-sm-2 thumbs imgCarousel">';
                    }
                    var alt = img[i].TextBild !== "" ? img[i].TextBild : "Bild " + i;
                    var p = imgPath + thumbs;
                    if (img[i].BildNamn.substring(0, 7) == 'http://') {
                        p = "";
                    }
                    var bild = img[i].BildNamn.replace("ImageSize=Original", "ImageSize=Small");
                    str += '<img src="' + p + bild + '" alt="' + alt + '" class="slide-six img-thumbnail img-responsive" onclick="slideCarousel(\'imgCarousel\', ' + i + ')"></div>';
                    $("#imgCarouselSlideContainer").append(str);
                }


                var rightSlide = '';
                rightSlide += '<div class="col-xs-2 col-sm-2">';
                rightSlide += '<div class="btn imageRotatorButton next-slide" onclick="slideRight(\'imgCarousel\')">';
                rightSlide += '<i class="fa fa-caret-right fa-2x"></i>';
                rightSlide += '</div>';
                rightSlide += '</div>';
                $("#imgCarouselSlideContainer").append(rightSlide);
                $("#imgModal").modal('show');
            } else {
                $("#myModalSessionTimeOut").modal('show');
                $("#restartButton").removeAttr("disabled");
            }
        }

    });
}



//*****************************************************************************************************************************************
// PRODUKTBLAD 
// @filtredObject -> Det object från listan i resultatet som visas
//*****************************************************************************************************************************************

$(document).on("click", '[data-trigger="tab"]', function (e) {
    var href = $(this).attr('href');
    e.preventDefault();
    $('[data-toggle="tab"][href="' + href + '"]').trigger('click');
});



// visar produktbladet
function printProdObjects(filtredObject, FromDate, ToDate) {
    actualObject = filtredObject;
    var objTypId = _objTypId == 105 ? 105 : 101;
    startSpinner("");
    getProdWebText();

    images = [];
    Get_LastDate(filtredObject[0].ObjectNr);
    var AccommodationForm, AccommodationType, Address, Area, AreaNr, Availability, CancellationInsurance, Capacity, City, Commune, CommuneCode, County, CountryCode, Department, Directions, ExBeds, ExtID, Facility, FacilityNr, Gallery, ImagePath, ImageType, KeyAddress, KeyWords, MiniPicture, NrOBedrooms, ObjectCategoryNr, ObjectClassNr, ObjectDescr, ObjectName, ObjectNr, ObjecttypeID, OrdBeds, Price, PriceCode, GrossPrice, Discount, RemoteID, RuleCode, ShortInfo, XCord, YCord, ZipCode, Beskrivning2, lat, long;
    var MyProdFilter = Enumerable.From(MyWebCtl).Where("$.ObjektTypId === " + objTypId + "  && $.ModulStyr === 'logiInf'").ToArray();

    $("#btnbook2").attr("disabled", "disabled");
    $("#btntobook").hide();

    $("#btnbook2").attr("disabled", "disabled");
    $("#btntobook").hide();
    $(".webbtext").hide();
    $(".webbtext2").show();
    $("#searchtop").hide();
    $("#tabLogi").hide();
    $("#divMainCals").hide();
    $("#DivArrivalHeader").hide();
    $("#DivDepartureHeader").hide();
    $("#searchfield").hide();
    $("#searchfield2").hide();
    $("#searchcontainer").hide();
    $("#spnHeader").hide();
    $("#inputKeywords").hide();
    $("#inputKeywords2").hide();
    $("#inputKeywords3").hide();
    $("#kartRow").hide();
    $("#objectcontainer").show(500);
    $("#rightColumn").show(500);

    AccommodationForm = filtredObject[0].AccommodationForm;
    AccommodationType = filtredObject[0].AccommodationType;
    Address = filtredObject[0].Address;
    Area = filtredObject[0].Area;
    AreaNr = filtredObject[0].AreaNr;
    Availability = filtredObject[0].Availability;
    Capacity = filtredObject[0].Capacity;
    City = filtredObject[0].City;
    Commune = filtredObject[0].Commune;
    CommuneCode = filtredObject[0].CommuneCode;
    CountryCode = filtredObject[0].CountryCode;
    County = filtredObject[0].County;
    Department = filtredObject[0].Department;
    ExBeds = filtredObject[0].ExBeds;
    ExtID = filtredObject[0].ExtID;
    Facility = filtredObject[0].Facility;
    FacilityNr = filtredObject[0].FacilityNr;
    Gallery = filtredObject[0].Gallery;
    ImagePath = filtredObject[0].ImagePath;
    ImageType = filtredObject[0].ImageType;
    MiniPicture = filtredObject[0].MiniPicture;
    NrOBedrooms = filtredObject[0].NrOBedrooms;
    ObjectCategoryNr = filtredObject[0].ObjectCategoryNr;
    ObjectClassNr = filtredObject[0].ObjectClassNr;
    ObjectName = filtredObject[0].ObjectName;
    ObjectNr = filtredObject[0].ObjectNr;
    ObjecttypeID = filtredObject[0].ObjecttypeID;
    OrdBeds = filtredObject[0].OrdBeds;
    Price = filtredObject[0].Price;
    GrossPrice = filtredObject[0].GrossPrice;
    totalPrice = filtredObject[0].Price;
    Discount = filtredObject[0].Discount;
    PriceCode = filtredObject[0].PriceCode;
    RemoteID = filtredObject[0].RemoteID;
    RuleCode = filtredObject[0].RuleCode;
    ShortInfo = filtredObject[0].ShortInfo;
    XCord = filtredObject[0].XCord;
    YCord = filtredObject[0].YCord;
    ZipCode = filtredObject[0].ZipCode;
    lat = filtredObject[0].Latitude;
    long = filtredObject[0].Longitude;

    $("#Regelkod").val(RuleCode);

    //Slår av flikar som inte ska visas
    if (MyProdFilter[0].Bild === 0) {
        $("#prodDivImg").hide();
    }
    if (MyProdFilter[0].Karta === 0) {
        $("#mapTab").hide();
    }
    if (MyProdFilter[0].Tillganglighet === 0) {
        $("#availabilityTab").hide();
    }

    if (!filtredObject[0].KeyWords) {
        var keywords = '';
    } else {
        var keywords = filtredObject[0].KeyWords;
    };

    var words = [];

    if (keywords.indexOf("|")) {
        keywords = keywords.split(";");
        for (c = 0; c < keywords.length - 1; c++) {
            var word = keywords[c].split("|");
            words.push(word[1]);

        }
        keywords = words;
    }
    if (keywords.length > 0) {
        var facilitiesString = '';

        for (i = 0; i < keywords.length; i++) {
            if (keywords[i] !== "") {
                facilitiesString += keywords[i] + ', ';
            }
        }

        facilitiesString = facilitiesString.substring(0, facilitiesString.length - 2);

        if (facilitiesString != null) {
            $("#prodimgKeyWords").show();
        }
    }
    else {
        facilitiesString = "";
        $("#prodimgKeyWords").hide();
    }


    if (!filtredObject[0].Gallery) {
        var gallery = '';
    } else {
        var gallery = filtredObject[0].Gallery;
        gallery.toString();
    }


    //Bildsnurran i produktbladet
    if (MyProdFilter[0].Bild === 1) {
        var imgPath = imagePath + "/";
        var thumbs = "";
        $.ajax({
            url: '../bmLogiFilt/LogiFilt.aspx/getImages',
            data: "{ objektnr: '" + ObjectNr + "' }",
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            dataType: 'json',
            success: function (data) {
                img = JSON.parse(data.d);
                $("#carouselBigContainer").empty();
                $("#carouselSlideContainer").empty();

                for (i = 0; i < img.length; i++) {
                    var str = '';
                    if (i == 0) {
                        str += '<div class="item active">';
                    } else {
                        str += '<div class="item">';
                    }
                    var alt = img[i].TextBild !== "" ? img[i].TextBild : "Bild " + i;
                    var p = imgPath;
                    if (img[i].BildNamn.substring(0, 7) == 'http://') {
                        p = "";
                    }
                    str += '<img src="' + p + img[i].BildNamn + '" alt="' + alt + '" title="' + alt + '" />';
                    str += '</div>';
                    $("#carouselBigContainer").append(str);
                }

                var leftSlide = '';
                leftSlide += '<div class="col-xs-2 col-sm-2">';
                leftSlide += '<div class="btn imageRotatorButton hiddenx prev-slide" onclick="slideLeft(\'myCarousel\')">';
                leftSlide += '<i class="fa fa-caret-left fa-2x"></i>';
                leftSlide += '</div>';
                leftSlide += '</div>';
                $("#carouselSlideContainer").append(leftSlide);

                for (i = 0; i < img.length; i++) {
                    var str = '';
                    if (i > 3) {
                        str += '<div class="col-xs-2 col-sm-2 thumbs myCarousel hiddenx">';
                    } else {
                        str += '<div class="col-xs-2 col-sm-2 thumbs myCarousel">';
                    }

                    var alt = img[i].TextBild !== "" ? img[i].TextBild : "Bild " + i;
                    var p = imgPath + thumbs;
                    if (img[i].BildNamn.substring(0, 7) == 'http://') {
                        p = "";
                    }
                    var bild = encodeURI(img[i].BildNamn.replace("ImageSize=Original", "ImageSize=Small"));
                    str += '<img src="' + p + bild + '" alt="' + alt + '" class="slide-six img-thumbnail img-responsive" onclick="slideCarousel(\'myCarousel\', ' + i + ')"></div>';
                    $("#carouselSlideContainer").append(str);
                }


                var rightSlide = '';
                rightSlide += '<div class="col-xs-2 col-sm-2">';
                rightSlide += '<div class="btn imageRotatorButton next-slide" onclick="slideRight(\'myCarousel\')">';
                rightSlide += '<i class="fa fa-caret-right fa-2x"></i>';
                rightSlide += '</div>';
                rightSlide += '</div>';
                $("#carouselSlideContainer").append(rightSlide);
                $("#myCarousel").carousel({
                    interval: false
                });
            }
        });
    }

    var stars = '';

    for (x = 0; x < filtredObject[0].ObjectClassNr; x++) {
        stars += '&#9733;';
    }

    var delimiter = "";
    if (MyProdFilter[0].ObjektTyp2 === 1 && AccommodationForm && AccommodationForm != "") {
        $(".AccommodationForm").html(AccommodationForm);
        delimiter = ", ";
    }
    if (MyProdFilter[0].ObjektTyp3 === 1 && AccommodationType && AccommodationType != "") {
        $(".AccommodationType").html(delimiter + AccommodationType);
    }

    if (MyProdFilter[0].ObjektTyp2 === 0 && MyProdFilter[0].ObjektTyp3 === 0) {
        $("#AccommodationTypeImg").hide();
    }

    $(".Address").html(Address);

    $(".Availability").html(Availability);
    $(".CancellationInsurance").html(CancellationInsurance);
    $(".City").html(City);


    delimiter = "";
    if (MyProdFilter[0].Avdelning === 1 && Department !== "") {
        if (Department != "Odefinerat" && Department != "Odefinierad") {
            $(".Department").html(Department);
            delimiter = ", ";
        } else {
            $(".Department").html("");
        }
    }
    if (MyProdFilter[0].Land === 1 && CountryCode !== "") {
        $(".CountryCode").html(delimiter + CountryCode);
        delimiter = ", ";
    }
    if (MyProdFilter[0].Lan === 1 && County !== "") {
        $(".County").html(delimiter + County);
        delimiter = ", ";
    }
    if (MyProdFilter[0].Kommun === 1 && Commune !== "") {
        $(".Commune").html(delimiter + Commune);
        $(".CommuneCode").html(CommuneCode);
        delimiter = ", ";
    }
    if (MyProdFilter[0].Omrade === 1 && Area !== "") {
        $(".Area").html(delimiter + Area);
        delimiter = ", ";
    }
    if (MyProdFilter[0].Anlaggning === 1) {
        if (Facility != "Odefinerat" && Facility != "Odefinierad") {
            $(".Facility").html(delimiter + Facility);
        } else {
            $(".Facility").html("");
        }
        $(".FacilityNr").html(FacilityNr);
    }

    if (MyProdFilter[0].Avdelning === 0 && MyProdFilter[0].Land === 0 && MyProdFilter[0].Lan === 0 && MyProdFilter[0].Kommun === 0 && MyProdFilter[0].Omrade === 0 && MyProdFilter[0].Anlaggning === 0) {
        $("#prodPlacesImg").hide();
    }

    if (MyProdFilter[0].Kapacitet === 1) {
        $(".OrdBeds").html(OrdBeds);
        $(".ExBeds").html(" + " + ExBeds);
    }
    $("#prodOrdBedsValue").val(OrdBeds);
    $("#prodExtBedsValue").val(ExBeds);

    $(".ExtID").html(ExtID);

    $(".ImagePath").html(ImagePath);
    $(".ImageType").html(ImageType);
    if (MyProdFilter[0].Sokord === 1) {
        $(".KeyWords").html(facilitiesString);
    }
    var forbiddenList = "";
    if (filtredObject[0].RuleCode == 1) {
        $("#prodSpnForbidden").html('<br/><img src="../images/noSmoke20.png" alt="' + FilterWebLanguage("ejRokning") + '" title="' + FilterWebLanguage("ejRokning") + '"/>');
    }
    if (filtredObject[0].RuleCode == 2) {
        $("#prodSpnForbidden").html('<br/><img src="../images/nopet20.png" alt="' + FilterWebLanguage("ejDjur") + '" title="' + FilterWebLanguage("ejDjur") + '"/>');
    }
    if (filtredObject[0].RuleCode == 3) {
        $("#prodSpnForbidden").html('<br/><img src="../images/noSmoke20.png" alt="' + FilterWebLanguage("ejRokning") + '" title="' + FilterWebLanguage("ejRokning") + '"/>' + ' <img src="../images/nopet20.png" alt="' + FilterWebLanguage("ejDjur") + '" title="' + FilterWebLanguage("ejDjur") + '"/>');
    }

    $(".MiniPicture").html(MiniPicture);
    $(".NrOBedrooms").html(NrOBedrooms);
    $(".ObjectCategoryNr").html(ObjectCategoryNr);
    if (MyProdFilter[0].Klass === 1) {
        $(".ObjectClassNr").html(stars);
    }

    delimiter = "";
    if (MyProdFilter[0].ObjektNr === 1 && ObjectNr && ObjectNr !== "") {
        $(".ObjectNr").html(ObjectNr);
        //delimiter = ", ";
        delimiter = " ";
    }
    if (MyProdFilter[0].ObjektNamn === 1) {
        $(".ObjectName").html(delimiter + ObjectName);
    }
    $(".ObjectNr").html(ObjectNr);
    $(".ObjecttypeID").html(ObjecttypeID);


    $.ajax({
        type: "POST",
        async: true,
        url: "LogiFilt.aspx/GetObjectInfo",
        data: "{ObjectNr: '" + ObjectNr + "', sprak: '" + Language + "'}",
        contentType: "application/json; charset=ISO-8859-9",
        dataType: "json",
        success: function (result) {
            var MyInfo = JSON.parse(result.d);
            if (MyInfo != null) {
                if (MyProdFilter[0].BeskrLong === 1) {
                    $(".Beskrivning2").html(MyInfo[0].Beskrivning2)
                }
                if (MyProdFilter[0].Beskr1 === 1) {
                    $(".ObjectDescr").html(MyInfo[0].ObjektBeskrivning);
                }
                if (MyProdFilter[0].Beskr2 === 1) {
                    $(".Directions").html(MyInfo[0].VagBeskrivning);
                }
                if (MyProdFilter[0].Beskr3 === 1) {
                    $(".KeyAddress").html(MyInfo[0].NyckelAdress);
                }
            } else {
                $("#myModalSessionTimeOut").modal('show');
                $("#restartButton").removeAttr("disabled");
            }

        },
        error: function (err) {
            if (debug == "true") {
                alert(err.status + " " + err.statusText);
            }
        }
    });

    if (MyProdFilter[0].Beskr1 === 1) {
        $(".Objdescr1").html(FilterWebLanguage("ObjBeskr1"))
    } else {
        $(".ObjectDescr").hide();
        $(".Objdescr1").hide();
    }
    if (MyProdFilter[0].Beskr2 === 1) {
        $(".Objdescr2").html(FilterWebLanguage("ObjBeskr2"))

    } else {
        $(".Directions").hide();
        $(".Objdescr2").hide();
    }
    if (MyProdFilter[0].Beskr3 === 1) {
        $(".Objdescr3").html(FilterWebLanguage("ObjBeskr3"))
    } else {
        $(".KeyAddress").hide();
        $(".Objdescr3").hide();
    }

    if (MyProdFilter[0].KartaOversikt === 1) {
        $("#oversiktButton").html('<a class="btn  btn-default" data-toggle="modal" data-target="#ovMap" href="#" onclick=\'loadOvMap("' + ObjectNr + '", "' + filtredObject[0].ObjectName + '")\'>' + FilterWebLanguage("Översiktskarta") + '</a>');
        $("#oversiktButton").show();
    } else {

    }

    $(".TillBoka").html(FilterWebLanguage("TillBoka"))

    Price += addontotal;

    $("#btnbook2").html(FilterWebLanguage("Lägg i kundkorg"));
    $("#btnbook2").attr("disabled", "disabled");

    $(".addonHeader").html(FilterWebLanguage("Tillägg rubrik"));

    //Logiobjekt med pris.
    $(".AccommodationHeader").html(FilterWebLanguage("Logi rubrik"));

    var AccommodationHtml = "<table style='width: 100%; valign: top' class='striped' id='bestalldaRader'>";
    AccommodationHtml += "<tr>";
    AccommodationHtml += "<td style='valign: top'><span id='Acc'>";
    if (MyProdFilter[0].ObjektNr === 1 && ObjectNr && ObjectNr !== "") {
        AccommodationHtml += ObjectNr + ", ";
    }
    AccommodationHtml += ObjectName;

    AccommodationHtml += "</span></td>";
    AccommodationHtml += "<td><span id='accArrivalDate'></span> -- <span id='accDepartureDate'></span></td>";
    if (Discount > 0) {
        AccommodationHtml += "<td class='alignright' id='logipris' style='valign: top'><h4 class='objectDiscountPrice' ><span id = 'AccPrice' >" + Price + "</span> <span id='AccCurrency'>" + Currency + "</span></h4>" + "<h5 class='objectGrossPrice' >" + GrossPrice + " " + Currency + "</h5>" + "</td>";
    } else {
        AccommodationHtml += "<td class='alignright' id='logipris' style='valign: top'><h4 class='objectPrice'><span id = 'AccPrice' >" + Price + " </span> <span id='AccCurrency'>" + Currency + "</span></h4></td>";
    }
    AccommodationHtml += "</tr>";
    AccommodationHtml += "</table>";
    $(".prodAccommodation").html(AccommodationHtml);


    var AccommodationHtml2 = "<div id='bestalldaRader2'>";
    AccommodationHtml2 += "<h6 class='orderObject' id='Acc2'>";
    if (MyProdFilter[0].ObjektNr === 1 && ObjectNr && ObjectNr !== "") {
        AccommodationHtml2 += ObjectNr + ", ";
    }
    AccommodationHtml2 += ObjectName + "</h6>";

    if (MyProdFilter[0].Avstand === 1) {
        getAvstand(ObjectNr);
    } else {
        $("#prodAvstand").hide();
    }

    $(".PriceCode").html(PriceCode);
    $(".RemoteID").html(RemoteID);
    $(".RuleCode").html(RuleCode);
    $(".ShortInfo").html(ShortInfo);
    $(".XCord").html(XCord);
    $(".YCord").html(YCord);
    $(".ZipCode").html(ZipCode);
    $("#availableCalendar").datepicker("destroy");
    $("#btnfullyear").show();
    $("#btnhidefullyear").hide();
    $("#objectcal").removeClass("col_12").addClass("col_6");

    $("#ProdSumTotal").html(totalPrice + " ");
    $("#ProdSumCurrency").html(Currency);
    $("#ProdSumTotal2").html(totalPrice + " ");
    $("#ProdSumCurrency2").html(Currency);

    $("#prodInputAdults").val($("#inputAdults").val());
    $("#prodInputChilds").val($("#inputChilds").val());
    $("#prodInputChildAges").val($("#inputChildAges").val());

    var childhtml = "";
    var selChilds = $("#inputChilds").val();
    var firstchildstring = 0;
    var childstring = "";

    if (selChilds < 1) {
        $('#prodDivChildAge').hide();
    }
    else if ((MyProdFilter[0].TypAntalB == 0 && MyProdFilter[0].MaxAlderB1 > 0) || (MyProdFilter[0].TypAntalB == 1 && MyProdFilter[0].MaxAlderB2 > 0)) {
        $('#prodDivChildAge').show();
        $("#btnbook2").attr("disabled", "disabled");

    }
    for (i = 0; i < selChilds; i++) {
        childhtml += "<select class='Pchildageinput' id='Pchild" + i + "' onchange='changeAges(true)' style='margin-bottom:3px; margin-left:5px;'>";
        childhtml += "<option value='--'>--</option>";
        var age = $("#child" + i).val();
        for (y = 0; y < childAge; y++) {
            var selected = age == y ? "selected" : "";
            childhtml += "<option value='" + y + "' " + selected + ">" + y + "</option>";
        }

        childhtml += "</select>";
    }

    for (i = 0; i < selChilds; i++) {
        if ($("#Pchild" + i).length) {
            if (10 > $("#Pchild" + i).val()) {
                childstring += "0" + $("#Pchild" + i).val();
            }
            else {
                childstring += $("#Pchild" + i).val();
            }
        } else {
            childstring += "00";
        }
    }

    ageStrOk = true;

    if ((MyProdFilter[0].TypAntalB == 0 && MyProdFilter[0].MaxAlderB1 > 0) || (MyProdFilter[0].TypAntalB == 1 && MyProdFilter[0].MaxAlderB2 > 0)) {
        $(".Pchildageinput").each(function (index) {
            if ($(this).val() == '--') {
                ageStrOk = false;
            }
        });
    }

    if (ageStrOk && ((MyProdFilter[0].TypAntalB == 0 && MyProdFilter[0].MaxAlderB1 > 0) || (MyProdFilter[0].TypAntalB == 1 && MyProdFilter[0].MaxAlderB2 > 0))) {
        $("#btnbook2").removeAttr("disabled");

    } else if (((MyProdFilter[0].TypAntalB == 0 && MyProdFilter[0].MaxAlderB1 == 0) || (MyProdFilter[0].TypAntalB == 1 && MyProdFilter[0].MaxAlderB2 == 0)) == 0 && dateSet) {
        $("#btnbook2").removeAttr("disabled");
        $("#btnbook2").show();
        $("#btntobook").hide();
    }

    $("#goBackBtn").show();
    $("#prodChildsAge").html(childhtml);
    $("#prodInputChildAges").val($("#inputChildAges").val());

    var adultText = FilterWebLanguage("Vuxna-box");
    if ($("#prodInputAdults").val() == "1") {
        adultText = FilterWebLanguage("Vuxen-box");
    }
    var childText = FilterWebLanguage("Barns-box");
    if ($("#prodInputChilds").val() == "1") {
        childText = FilterWebLanguage("Barn-box");
    }

    var andraText = FilterWebLanguage("andravb");

    if ((MyProdFilter[0].TypAntalB == 0 && MyProdFilter[0].MaxAntalB1 > 0) || (MyProdFilter[0].TypAntalB == 1 && MyProdFilter[0].MaxAntalB2 > 0)) {
        AccommodationHtml2 += "<p class='nrOfPersons'><span class='nrOfAdultText'>" + $("#prodInputAdults").val() + "</span> <span class='adultText'>" + adultText + "</span>, <span class='nrOfChildText'>" + $("#prodInputChilds").val() + "</span> <span class='childText'>" + childText + "</span> <a href='#' data-toggle='modal' data-target='#nrOfPersonsModal'><span class='andravb'>" + andraText + "</span></a></p>";
    } else {

        AccommodationHtml2 += "<p class='nrOfPersons'><span class='nrOfAdultText'>" + $("#prodInputAdults").val() + "</span> <span class='adultText'>" + adultText + "</span> <a href='#' data-toggle='modal' data-target='#nrOfPersonsModal'><span class='andravb'>" + andraText + "</span></a></p>";
    }
    AccommodationHtml2 += "<p class='orderDates' style='float:left;'><span id='accArrivalDate2'></span> -- <span id='accDepartureDate2'></span>" + "</p>";

    if (Discount > 0) {
        AccommodationHtml2 += "<span id='logipris2'><h5 class='objectDiscountPrice alignright ' ><span id = 'AccPrice2' >" + Price + "</span> <span id='AccCurrency2'>" + Currency + "</span></h5>" + "<h6 class='objectGrossPrice' >" + GrossPrice + " " + Currency + "</h6></span>";
    } else {
        AccommodationHtml2 += "<span id='logipris2'><h5 class='objectPrice alignright '><span id = 'AccPrice2' >" + Price + " </span> <span id='AccCurrency2'>" + Currency + "</span></h5></span>";
    }

    AccommodationHtml2 += "</div>";

    AccommodationHtml2 += "<div id='tillaggRader2' style='width: 100%'>";
    AccommodationHtml2 += "</div>";
    $(".prodAccommodation2").html(AccommodationHtml2);
    ShowProdCalendars();

    $(function () {
        $("#prodtextArrival").bind("click", function (e) {
            $("#prodArrival").toggle();
            $("#prodDeparture").toggle();
        });
    });

    stopSpinner("");
    $("#btnbook2").attr("disabled", "disabled");
}


// Visar avståndstabell
function getAvstand(ObjectNr) {
    $.ajax({
        type: "POST",
        async: true,
        url: "LogiFilt.aspx/GetAvstand",
        data: "{ObjTypeID: '" + ObjectNr + "', sprak: ''}",
        contentType: "application/json; charset=ISO-8859-9",
        dataType: "json",
        success: function (result) {
            var avstand = JSON.parse(result.d);
            var str = "";
            if (avstand != null) {

                str = "<table class='avstand'>";
                for (i = 0; i < avstand.length; i++) {
                    str += "<tr>";
                    var langd = avstand[i].Varde + " m";
                    if (avstand[i].Varde > 1000) {
                        langd = avstand[i].Varde / 1000 + " km";
                    }
                    str += "<td>" + avstand[i].Ledtext + "</td><td class='right'>" + langd + "</td>";
                    str += "</tr>";
                }
                str += "</table>";
            }

            $("#prodAvstand").html(str);
            $("#searchAvstand_" + ObjectNr).html(str);
        },
        error: function (err) {
            if (debug == "true") {
                alert(err.status + " " + err.statusText);
            }
        }
    });
}


// Uppdaterar objektinformation inkl pris i produktbladet
function updateProdBookingOrder(objectNr, FromDate, ToDate, Adults, Childs, AgeStr, Language, DiscountCode, pinputGeoId, pinputGeoType, avdelning) {
    startSpinner("");
    var objTypId = _objTypId == 105 ? 105 : 101;
    var MyFilter = Enumerable.From(MyWebCtl).Where("$.ObjektTypId === " + objTypId + "  && $.ModulStyr === 'logiFil'").ToArray();
    var land = "";
    var Lan = "";
    var Kommun = "";
    var totalPrice = 0;
    var objektTypId = 0;
    $.ajax({
        type: "POST",
        async: true,
        url: "LogiFilt.aspx/GetObjData",
        data: "{FromDate: '" + FromDate + "', ToDate: '" + ToDate + "', Adults: '" + Adults + "', Childs: '" + Childs + "', AgeStr: '" + AgeStr + "', Language: '" + Language + "', ObjectNr: '" + objectNr + "', DiscountCode: '" + DiscountCode + "',  land: '" + land + "' , Lan: '" + Lan + "', Kommun:'" + Kommun + "',  geoId: '" + pinputGeoId + "', geoKopplingstyp: '" + pinputGeoType + "', avdelning: '" + avdelning + "', type: 'update', objektTypId: '" + objektTypId + "', friSok: '', keyW: '', AnlStatus: '', omrade: '', paketNr: '" + cleanForInjection($("#inputPaket").val()) + "'}",
        contentType: "application/json; charset=ISO-8859-9",
        dataType: "json",
        success: function (result) {
            MyObj = JSON.parse(result.d);
            if (MyObj != null) {
                var AccommodationHtml = "";
                var AccommodationHtml2 = "";
                if (MyObj.length > 0) {
                    
                    $("#logipris2").empty();

                    var price = MyObj[0].Price;
                    totalPrice = totalPrice + price;
                    if (MyObj[0].Discount > 0) {
                        AccommodationHtml += "<h4 class='objectDiscountPrice' ><span id = 'AccPrice' >" + price + "</span> <span id='AccCurrency'>" + Currency + "</span></h4>" + "<h5 class='objectGrossPrice' >" + MyObj[0].GrossPrice + " " + Currency + "</h5>" + "";
                        AccommodationHtml2 += "<h4 class='objectDiscountPrice' ><span id = 'AccPrice2' >" + price + "</span> <span id='AccCurrency2'>" + Currency + "</span></h4>" + "<h5 class='objectGrossPrice' >" + MyObj[0].GrossPrice + " " + Currency + "</h5>" + "";

                    } else {
                        AccommodationHtml += "<h5 class='objectPrice'><span id = 'AccPrice' >" + price + " </span> <span id='AccCurrency'>" + Currency + "</span></h5>";
                        AccommodationHtml2 += "<h5 class='objectPrice'><span id = 'AccPrice2' >" + price + " </span> <span id='AccCurrency2'>" + Currency + "</span></h5>";
                    }

                    ageStrOk = true;

                    $(".Pchildageinput").each(function (index) {
                        if ($(this).val() == '--') {
                            ageStrOk = false;
                        }
                    });
                    if (ageStrOk) {
                        
                        $("#btnbook2").removeAttr("disabled");
                        $("#btnbook2").show();
                        $("#btntobook").hide();
                    }
                    
                    $("#logipris2").html(AccommodationHtml2);
                    var childs = 0;
                    if (MyFilter[0].TypAntalB == 0) {
                        childs = $("#prodInputChilds").val();
                    }
                    $.ajax({
                        type: "POST",
                        async: true,
                        url: "LogiFilt.aspx/GetAutoTillagg",
                        data: "{FromDate: '" + FromDate + "', ToDate: '" + ToDate + "', Adults: '" + $("#prodInputAdults").val() + "', Childs: '" + childs + "', Language: '" + Language + "', ObjectNr: '" + objectNr + "'}",
                        contentType: "application/json; charset=ISO-8859-9",
                        dataType: "json",
                        success: function (result) {
                            var MyATill = JSON.parse(result.d);
                            
                            if (MyATill.length > 0) {
                                $("#bestalldaRader").find("tr:gt(0)").remove();
                                $("#tillaggRader2").empty();
                                for (var i = 0; i < MyATill.length; i++) {
                                    var price = MyATill[i].AutoPris;
                                    if (MyATill[i].Bock == 0) {
                                        autotillagg = true;
                                    }
                                    var checked = "";
                                    if (autotillagg == false) {
                                        totalPrice = totalPrice;
                                    } else {
                                        totalPrice = totalPrice + price;
                                        checked = " checked='checked' "
                                    }
                                    
                                    if (price != 0) {
                                        var AccommodationHtml = "<tr>";
                                        if (MyATill[i].Bock == "1") {
                                            AccommodationHtml += "<td>";
                                            AccommodationHtml += "<input type='checkbox' id='auto_" + MyATill[i].Objektnr + "'/>"
                                            AccommodationHtml += "</td><td>";
                                        } else {
                                            AccommodationHtml += "<td colspan='2'>";
                                        }
                                        AccommodationHtml += "<span id='Till" + i + "'>" + MyATill[i].Benamning + "</span></td>";
                                        AccommodationHtml += "<td></td>";
                                        AccommodationHtml += "<td class='alignright'><span id = 'AccPrice" + i + "'>" + price + " </span><span id='AccCurrency" + i + "'>" + Currency + "</span></td>";
                                        AccommodationHtml += "</tr>";
                                        $("#bestalldaRader").append(AccommodationHtml);

                                        var AccommodationHtml2 = "<h6 style='font-size:1px;line-height: 1px; margin-top: 2px; margin-bottom: 2px '></h6>";
                                        AccommodationHtml2 += "<p class='orderDates' style='float:left;'>";
                                        if (MyATill[i].Bock == "1") {
                                            AccommodationHtml2 += "<input type='checkbox' id='auto_" + MyATill[i].Objektnr + "' " + checked + " class='autotillagg' onchange='updateprice(\"" + MyATill[i].Objektnr + "\")'/>"
                                        }
                                        AccommodationHtml2 += " &nbsp; <span id='Till2_" + i + "'>" + MyATill[i].Benamning + "</span>";
                                        if (MyATill[i].Objektbeskrivning.length > 0) {
                                            AccommodationHtml2 += " &nbsp; <img src='../img/icons/information.png' id='imgdescr_" + MyATill[i].Objektnr + "' alt='' class='infolink' title='' onclick='alert(\"" + MyATill[i].Objektbeskrivning + "\", \"" + MyATill[i].Benamning + "\")'/>";
                                        }
                                        AccommodationHtml2 += "</p>";
                                        AccommodationHtml2 += "<span class='alignright'><h5 class='addonPrice'><span id = 'AccPrice2_" + MyATill[i].Objektnr + "'>" + price + " </span><span id='AccCurrency2_" + MyATill[i].Objektnr + "'>" + Currency + "</span></h5></span>";
                                        $("#tillaggRader2").append(AccommodationHtml2);

                                    }
                                }
                            } else {
                                $("#tillaggRader2").empty();
                            }
                            $("#ProdSumTotal2").html(totalPrice + " ");
                            $("#ProdSumCurrency2").html(Currency);
                            stopSpinner("");
                        },
                        error: function (err) {
                            if (debug == "true") {
                                alert(err.status + " " + err.statusText);
                            }
                            stopSpinner("");
                        }
                    });
                } else {

                    $("#btnbook2").attr("disabled", "disabled");

                    $("#bestalldaRader").find("tr:gt(0)").remove();
                    $("#logipris2").empty();
                    AccommodationHtml2 = "<h5 class='objectPrice'><span id = 'AccPrice' >" + FilterWebLanguage("GarEjAttBoka") + " </span> <span id='AccCurrency'></span></h5>";
                    $("#AccCurrency").html("");
                    $("#ProdSumTotal2").html("0" + " ");
                    $("#logipris2").html(AccommodationHtml2);
                    stopSpinner("");
                }
            } else {
                $("#myModalSessionTimeOut").modal('show');
                $("#restartButton").removeAttr("disabled");
            }
        },
        error: function (err) {
            if (debug == "true") {
                alert(err.status + " " + err.statusText);
            }
        }
    });

}