<?php

    $fileName = 'uk.json';
    if(isset($_REQUEST['fileName'])){
        $fileName = $_REQUEST['fileName'];
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <title>Custom Query</title>
    <link rel="shortcut icon" href="Content/Images/favicon.ico" type="image/x-icon">
    <link rel="icon" href="Content/Images/favicon.ico" type="image/x-icon">
    <meta name="viewport" content="width=device-width" />
    <script src="Scripts/jquery-2.0.3.js"></script>

    <link href="Content/site.css" rel="stylesheet"/>

    <script src="Scripts/highcharts.js"></script>
    <script type="text/javascript">    
        var yearMin = 2010;
        var usa_Regions = ["SF Bay", "New York", "Boston", "Los Angeles", "Seattle", "Washington DC", "San Diego", "Denver", "Austin", "Chicago", "Atlanta", "Philadelphia", "Dallas", "Raleigh-Durham", "Salt Lake City", "Portland", "Minneapolis", "Pittsburg"];
        var uk_Regions = ["London","United Kingdom - Other","Manchester","Edinburgh","Bristol","Birmingham","Glasgow","Leeds","Newcastle","Sheffield","Nottingham","Liverpool","Cardiff"];
        var fileName;
        var static_Regions;
        var static_Categories = ["software", "biotech", "web", "enterprise", "mobile", "advertising", "cleantech", "ecommerce", "medical", "hardware", "games_video", "analytics", "health", "semiconductor", "network_hosting", "finance", "social", "real_estate"];
        $(document).ready(function(){
            fileName = '<?php echo $fileName; ?>';  
            console.log(fileName);
            $('#Selelct_Country option').each(function(){
                if($(this).val() == fileName){
                    $(this).attr('selected','selected');
                }
            })
            static_Regions = [];
            var i;
            if(fileName.search('usa') > -1){
                static_Regions = usa_Regions;
            }else if(fileName.search('uk') > -1){
                static_Regions = uk_Regions;
            }
            $('#Selelct_Country').change(function(){
                var cur_href = window.location.href.split('?')[0];
                window.location.href = cur_href+"?fileName="+$(this).val();
            })
        })
    </script>
    <script src="Scripts/data.js"></script>
    <script src="https://code.highcharts.com/modules/drilldown.js"></script>

    <link href="Content/Hist.css" rel="stylesheet"/>

    <script src="Scripts/histTrends.js"></script>

    <script src="Scripts/Spin.js"></script>
    <script src="Scripts/SpinItem.js"></script>



</head>
<body>
    <div id="FullPage">
        <div id="container">
            <div id="topNav">

                <img id="logo" src="Images/logo.png" />
                <div id="LoginControlDiv">
                    <select id="Selelct_Country" style="position:absolute;right:0;top:0;">
                        <option value='usa.json'>United States</option>
                        <option value='uk.json'>United Kindom</option>
                    </select>
                </div>

            </div>

            <div id="content">

                <div id="MainDiv">
                    <a class="orangePageHeader">PieChart</a>
                    <div class="HTMainDivs">
                        <div id="HTTextContent">
                            Investment dollars 
                            <a id="inCategory"></a> 
                            <a id="fromDate" class="TitleTxtR">Q1 2010</a> to 
                            <a id="toDate" class="TitleTxtR">Q4 2013</a>
                            <a id="byStr"></a>.
                            <br/>
                        </div>
                    </div>

                    <div id="cartDivMasterContainer">
                        <div id="ChartDivCur"></div>
                    </div>

                </div>

                <div>
                    <form action="/HistoricTrends/CustomQueryHistoricTrend" id="HTFilterForm" method="post" name="HTFilterForm">

                        <div id="FiltHeader">

                            <label id="header">Filter data</label>

                            <div id="backToHistorical" class="SelectClearOption">Back to historical</div>

                            <div id="dateRange">

                            <div id="DateErrorMsgDiv" style="display: none"></div>


                            <div id="Qtr2" class="SelBox">
                                <select name="Qtr2" class="dropdown">
                                </select>
                            </div>
                            <div class="DateSecLevelLabel">to</div>

                            <div id="Qtr1" class="SelBox">

                                <select name="Qtr1" class="dropdown">

                                </select>
                            </div>
                            <div class="DateSecLevelLabel">Date range: </div>
                            </div>
                        </div>

                    </form>
                </div>

            </div>
            <div id="footer">
            </div>

        </div>
    </div>

</body>
</html>
