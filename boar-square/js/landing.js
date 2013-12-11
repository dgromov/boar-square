$(function () {

  var venueCount=0;
  initialParameters = {
    'location': $('#location').val(),
    'startTime' : $('#startTime').val(),
    'endTime' : $('#endTime').val(),
    'venueName1' : $('#venuename1').val(),
    'category1' : '',
    'price1' : $('#trending1').val(),
    'trending1' : $('#trending1').val(),
    'venueName2' : $('#venuename2').val(),
    'category2' : '',
    'price2' : '',
    'trending2' : $('#trending2').val(),
    'venueName3' : $('#venuename3').val(),
    'category3' : '',
    'price3' : '',
    'trending3' : $('#trending3').val(),
  };

  //If Create new is clicked
  $('#newDate').click( function() {

        // $("#bottomLogo").addClass("hidden");
        $(".jumbotron").animate({height:"+=225px"}, 200);
        $("#landing-date-planning").removeClass("hidden");
        
        document.getElementById('newDate').disabled=true;
        document.getElementById('oldDate').disabled=true;


        return false;
      });

//If choose existing is called
$('#oldDate').click( function() {


  $(".jumbotron").animate({height:"+=225px"}, 200);
  $(".form-group").removeClass("hidden");

  document.getElementById('newDate').disabled=true;
  document.getElementById('oldDate').disabled=true;


  return false;
});




$('#addVenue').click( function() {
  if(venueCount==3)
    document.getElementById('addVenue').disabled=true;

  else{
        // $("#bottomLogo").addClass("hidden");
        $(".jumbotron").animate({height:"+=200px"}, 200);
        if(venueCount==2){
          $("#venue3").removeClass("hidden");
          
          document.getElementById('addVenue').disabled=true;
          $( "#addVenue" ).empty();
          $( "#addVenue" ).append("Maximum Date Spots Added!");
        }


        if(venueCount==1){
          $("#venue2").removeClass("hidden");
          venueCount++;
          $( "#addVenue" ).empty();
          $( "#addVenue" ).append("Add Up to <strong><font size=14>1</font></strong> More Date Spot (Optional)");
        }

        if(venueCount==0){
          $("#venue1").removeClass("hidden");
          venueCount++;
          $( "#addVenue" ).empty();
          $( "#addVenue" ).append("Add Up to <strong><font size=14>2</font></strong> More Date Spot (Optional)");

        }

      }



      return false;
    });



$('.filters').click( 
  function autofill(){

    console.dir(this.value);

    if(this.value==1){
      venuename1.value="(Category: "+this.name+")";
      initialParameters.category1=this.name;
      $('#category1params').hide();
      $('#category1params').removeClass("hidden");
      $('#category1params').fadeIn('slow');


    }

    if(this.value==2){
      venuename2.value="(Category: "+this.name+")";
      initialParameters.category2=this.name;
      $('#category2params').hide();
      $('#category2params').removeClass("hidden");
      $('#category2params').fadeIn('slow');


    }

    if(this.value==3){


      venuename3.value="(Category: "+this.name+")";
      initialParameters.category3=this.name;
      $('#category3params').hide();
      $('#category3params').removeClass("hidden");
      $('#category3params').fadeIn('slow');


    }

  });


       //Make a Date


       $('#goDate').click(function(e) {
        e.preventDefault();
        e.stopPropagation(); 

        initialParameters = {
          'location': $('#location').val(),
          'startTime' : $('#startTime').val(),
          'endTime' : $('#endTime').val(),
          'venue1' : $('#venuename1').val(),
          'price1' : $('input[name=price1]:checked').val(),
          'venue2' : $('#venuename2').val(),
          'price2' : $('input[name=price2]:checked').val(),
          'venue3' : $('#venuename3').val(),
          'price3' : $('input[name=price3]:checked').val(),
        };

        console.dir(initialParameters);

        var query = 'location=' + initialParameters.location;
            //query+= '&startTime=' + initialParameters.startTime;
            //query+= '&endTime=' + initialParameters.endTime;
            // query+= '&category1=' + initialParameters.category1;
            // query+= '&venue1=' + initialParameters.venue1;
            // query+= '&price1=' + initialParameters.price1;
            // query+= '&category2=' + initialParameters.category2;
            // query+= '&venue2=' + initialParameters.venue2;
            // query+= '&price2=' + initialParameters.price2;
            // query+= '&category3=' + initialParameters.category3;
            // query+= '&venue3=' + initialParameters.venue3;
            // query+= '&price3=' + initialParameters.price3;
            window.location.replace("./index.html?" + query);
        });

// What happens if we hit load date from file??
$('#LoadDate').click(function(e) {
  window.location.replace("./index.html?");

});

$(document).ready(function (){
  $("#startTime").clockpick({
    starthour : 8,
    endhour : 23,
    layout : "horizontal"
          // event : "mouseover"
        });

  $("#endTime").clockpick({
    starthour : 8,
    endhour : 23,
    layout : "horizontal"
          // event : "mouseover"

        });

});

});

