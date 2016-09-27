var static_Categories = ["software", "biotech", "web", "enterprise", "mobile", "advertising", "cleantech", "ecommerce", "medical", "hardware", "games_video", "analytics", "health", "semiconductor", "network_hosting", "finance", "social", "real_estate"];
var all_Data;
var selected_Category = "";

function quarterTextToggle(year) {
    if (year != null) {
        var pattern = "Q[1234] \\d{4}";
        if (year.match(pattern)) {
            return year.substring(3, 7) + '-' + year.charAt(1);
        } else if (year.match("^\\d{4}-[1234]")) {
            return 'Q' + year.charAt(5) + " " + year.substring(0, 4);
        } else if(year.match("^Qtr:\\d{4}-[1234]")){
            var temp = year.substring(4, 8) + " Qtr" + year[9]
            if (year.length > 10) {
                temp += year.substring(10);
            }
            return temp;
        }else{
            return year;
        }
    }
}

function PieChart(jsonData,appendFlag,startDate,endDate){
    var CategoryData = [];
    var StageData = [];
    var Category = jsonData.Category;
    var Amount_Raised_USD = jsonData.Amount_Raised_USD;
    var Funded_At = jsonData.Funded_At;
    var Stage = jsonData.Stage;
    var Length = Category.length;
    var i, j, k;

    if(appendFlag){
        var XAxisTic = [];
        for(i = 0; i < Length; i++){
            var date = Funded_At[i];
            if(date.length > 1){
                var month, year;
                if(date.search('/') > 0){
                    var date_arr = date.split("/");
                    month = parseInt(date_arr[1]);
                    year = parseInt(date_arr[2]);
                }else{
                    var date_arr = date.split("-");
                    month = parseInt(date_arr[1]);
                    year = parseInt(date_arr[0]);
                }
                if(year > yearMin){
                    for(j = 0; j < XAxisTic.length; j++){
                        var x_date = XAxisTic[j];
                        var x_date_arr = x_date.split("-");
                        var x_year = x_date_arr[0];
                        if(year == x_year) break;
                    }

                    if(j == XAxisTic.length){
                        XAxisTic.push(year+"-1");
                        XAxisTic.push(year+"-2");
                        XAxisTic.push(year+"-3");
                        XAxisTic.push(year+"-4");
                    }
                }
            }
        }

        for(i = 0; i < XAxisTic.length-1; i++){
            for(j = i; j < XAxisTic.length; j++){
                if(XAxisTic[i] > XAxisTic[j]){
                    var tmp = XAxisTic[i];
                    XAxisTic[i] = XAxisTic[j];
                    XAxisTic[j] = tmp;
                }
            }
        }

        for(i = 0; i < XAxisTic.length; i++){
            var date = XAxisTic[i];
            var date_arr = date.split("-");
            var year = parseInt(date_arr[0]);
            var quarter = parseInt(date_arr[1]);
            $('#Qtr1 .dropdown').append('<option value="'+year+'-'+quarter+'">Q'+quarter+' '+year+'</option>');
            $('#Qtr2 .dropdown').prepend('<option value="'+year+'-'+quarter+'">Q'+quarter+' '+year+'</option>');
        }
        $('#Qtr1 .dropdown option:first-child').attr("selected", "selected");
        $('#Qtr2 .dropdown option:first-child').attr("selected", "selected");
    }

    var startPos = 0, endPos = Length;

    var startDate_arr = startDate.split("-");
    var startDate_year = parseInt(startDate_arr[0]);
    var startDate_quarter = parseInt(startDate_arr[1]);
    var endDate_arr = endDate.split("-");
    var endDate_year = parseInt(endDate_arr[0]);
    var endDate_quarter = parseInt(endDate_arr[1]);

    for(i = 0; i < static_Categories.length; i++){
        var obj = {name:static_Categories[i], y:0, drilldown: static_Categories[i]};
        CategoryData.push(obj);
        obj = {name:static_Categories[i], id: static_Categories[i], data:[]};
        StageData.push(obj);
    }

    for(i = startPos; i < endPos; i++){


        var date = Funded_At[i];
        if(Amount_Raised_USD[i] != null && date.length > 1){
            var date_year, date_month;
            if(date.search('/') > 0){
                var date_arr = date.split("/");
                date_year = parseInt(date_arr[2]);
                date_month = parseInt(date_arr[1]);
            }else{
                var date_arr = date.split("-");
                date_year = parseInt(date_arr[0]);
                date_month = parseInt(date_arr[1]);
            }
            if((date_year>startDate_year && date_year<endDate_year)
                || (startDate_year != endDate_year && date_year == startDate_year && date_month>=(startDate_quarter-1)*3)
                || (startDate_year != endDate_year && date_year == endDate_year && date_month<=endDate_quarter*3)
                || (startDate_year == endDate_year && date_year == endDate_year && date_month>=(startDate_quarter-1)*3 && date_month<=endDate_quarter*3)){

                for(j = 0; j < static_Categories.length; j++){
                    if(Category[i] == static_Categories[j]) break;
                }
                if(j < static_Categories.length){
                    CategoryData[j].y += parseInt(Amount_Raised_USD[i]);
                    var stage_arr = StageData[j].data;
                    for(k = 0; k < stage_arr.length;k++){
                        if(Stage[i] == stage_arr[k][0]) break;
                    }
                    if(k == stage_arr.length){
                        var dt = [Stage[i],0];
                        StageData[j].data.push(dt);
                    }else{
                        StageData[j].data[k][1] += parseInt(Amount_Raised_USD[i]);
                    }
                }
            }
        }
    }

    drawGraph(CategoryData,StageData);
}

$(document).ready(function () {

    setSpinner('cartDivMasterContainer');
    startSpinner();

    //To reetreive JSON data and display the chart
    $.getJSON("Data/"+fileName).done(function (jsonData) {
        all_Data = jsonData;
        PieChart(all_Data,true,"2010-1","2013-4");
        $('#byStr').html('by Category');
        stopSpinner();
    });

    var preStart;
    var preEnd;

    $("#Qtr1 .dropdown").on('focus', function () {
        // Store the current value on focus and on change
        preStart = this.value;
    }).change(function() {
        var startDate = $('#Qtr1 .dropdown').val();
        var endDate = $('#Qtr2 .dropdown').val();
        if(startDate <= endDate){
            $('#fromDate').html(quarterTextToggle(startDate));
            PieChart(all_Data,false,startDate,endDate);
        }else{
            alert('StartDate should be less than EndDate');
            // $(this).val(preStart);
        }
    });

    $("#Qtr2 .dropdown").on('focus', function () {
        // Store the current value on focus and on change
        preEnd = this.value;
    }).change(function() {
        var startDate = $('#Qtr1 .dropdown').val();
        var endDate = $('#Qtr2 .dropdown').val();
        if(startDate <= endDate){
            $('#toDate').html(quarterTextToggle(endDate));
            PieChart(all_Data,false,startDate,endDate);
        }else{
            alert('EndDate should be greater than StartDate');
            // $(this).val(preEnd);
        }
    });

    $('body').on('click',function(e){
        var obj = $(e.target);
        var context = obj.context;
        if(context.innerHTML.search("Back to Category")>0 || context.gradient == "x1,0,y1,0,x2,0,y2,1,0,#FFF,1,#ACF"){
            $('#byStr').html("by Category");
            $('#inCategory').html("");
        }
    });

});

function drawGraph(CategoryData,StageData){
    $('#ChartDivCur').html("");
    $('#ChartDivCur').highcharts({
        chart: {
            type: 'pie'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}: ${point.y}'
                }
            }
        },

        tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>${point.y}</b> of total<br/>'
        },
        series: [{
            name: 'Category',
            colorByPoint: true,
            data: CategoryData,
            cursor: 'pointer',
            point: {
                events: {
                    mouseOver: function (e) {
                        selected_Category = this.name;
                    },
                    click: function(e){
                        $('#inCategory').html("in "+selected_Category);
                        $('#byStr').html("by Stage");
                    }
                }
            }
        }],
        drilldown: {
            series: StageData
        }
    });
}