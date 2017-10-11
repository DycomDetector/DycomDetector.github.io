function createByJson() {
  var jsonData = [          
          {description:'Choos your payment gateway', value:'', text:'Payment Gateway'},         
          {image:'images/msdropdown/icons/Amex-56.png', description:'My life. My card...', value:'amex', text:'Amex'},
          {image:'images/msdropdown/icons/Discover-56.png', description:'It pays to Discover...', value:'Discover', text:'Discover'},
          {image:'images/msdropdown/icons/Mastercard-56.png', title:'For everything else...', description:'For everything else...', value:'Mastercard', text:'Mastercard'},
          {image:'images/msdropdown/icons/Cash-56.png', description:'Sorry not available...', value:'cash', text:'Cash on devlivery', disabled:true},
          {image:'images/msdropdown/icons/Visa-56.png', description:'All you need...', value:'Visa', text:'Visa'},
          {image:'images/msdropdown/icons/Paypal-56.png', description:'Pay and get paid...', value:'Paypal', text:'Paypal'}
          ];
  $("#byjson").msDropDown({byJson:{data:jsonData, name:'payments2'}}).data("dd");
}
$(document).ready(function(e) {   
  //no use
  try {
    var pages = $("#pages").msDropdown({on:{change:function(data, ui) {
                        var val = data.value;
                        if(val!="")
                          window.location = val;
                      }}}).data("dd");

    var pagename = document.location.pathname.toString();
    pagename = pagename.split("/");
    pages.setIndexByValue(pagename[pagename.length-1]);
    $("#ver").html(msBeautify.version.msDropdown);
  } catch(e) {
    //console.log(e); 
  }
  
  $("#ver").html(msBeautify.version.msDropdown);
    
  //convert
  $("select").msDropdown({roundedBorder:false});
  createByJson();
  $("#tech").data("dd");
});
function showValue(h) {
  console.log(h.name, h.value);
}
$("#tech").change(function() {
  console.log("by jquery: ", this.value);
})
//