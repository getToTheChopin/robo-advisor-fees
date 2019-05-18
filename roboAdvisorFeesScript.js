var startingPortfolio = document.getElementById("startingPortfolio");
var annualSavings = document.getElementById("annualSavings");
var annualReturn = document.getElementById("annualReturn");
var annualFee = document.getElementById("annualFee");
var annualHoursSpent = document.getElementById("annualHoursSpent");
var numYears = document.getElementById("numYears");

var startingPortfolioValue;
var annualSavingsValue;
var annualReturnValue;
var annualFeeValue;
var annualHoursSpentValue;
var numYearsValue;

var outputBarChart = document.getElementById("outputBarChart");
var outputTextDiv = document.getElementById("outputTextDiv");

var fullChart = document.getElementById("fullChart");

var endDIYPortfolioValue = 0;
var endRoboPortfolioValue = 0;

var endSavings = 0;
var endSavingsDirect = 0;
var endSavingsIndirect = 0;

var endHoursSpent = 0;
var endHourlyRate = 0;
var endPercentLost = 0;

var diyPortfolioArray = [];
var roboPortfolioArray = [];
var yearArray = [];

var cumDirectFees = 0;

var chart;
var chart2;

var startingPortfolioSlider = document.getElementById("startingPortfolioSlider");
var annualSavingsSlider = document.getElementById("annualSavingsSlider");
var annualReturnSlider = document.getElementById("annualReturnSlider");
var annualFeeSlider = document.getElementById("annualFeeSlider");
var annualannualHoursSpentSliderlider = document.getElementById("annualHoursSpentSlider");
var numYearsSlider = document.getElementById("numYearsSlider");


//main method
addInputEventListeners();
getUserInputs();
showOutputs();


//slider updates -- mutual updating between slider and num input
annualReturnSlider.oninput = function() {
    annualReturn.value = this.value;
}
annualReturn.oninput = function() {
    annualReturnSlider.value = this.value;
}

annualFeeSlider.oninput = function() {
    annualFee.value = this.value;
}
annualFee.oninput = function() {
    annualFeeSlider.value = this.value;
}

annualHoursSpentSlider.oninput = function() {
    annualHoursSpent.value = this.value;
}
annualHoursSpent.oninput = function() {
    annualHoursSpentSlider.value = this.value;
}

numYearsSlider.oninput = function() {
    numYears.value = this.value;
}
numYears.oninput = function() {
    numYearsSlider.value = this.value;
}


function addInputEventListeners() {
    var inputsArray = document.getElementsByClassName("userInput");
    console.log("# of event listeners: "+inputsArray.length);

    for(i=0;i<inputsArray.length;i++) {
        inputsArray[i].addEventListener('change',refreshChart, false);
    }
}


function getUserInputs(){
    startingPortfolioValue = Number(document.getElementById("startingPortfolio").value);
    annualSavingsValue = Number(document.getElementById("annualSavings").value);
    annualReturnValue = Number(document.getElementById("annualReturn").value);
    annualFeeValue = Number(document.getElementById("annualFee").value);
    annualHoursSpentValue = Number(document.getElementById("annualHoursSpent").value);
    numYearsValue = Number(document.getElementById("numYears").value);
}


function showOutputs(){
    generateArrays();

    outputTextDivPrimary.innerHTML = "<p>After <span class=\"highlightText\">"+numYearsValue+"</span> years, DIY investing will save you a total of <span class=\"highlightTextBig\">$"+Math.round(endSavings).toLocaleString()+"</span>.</p>";
    outputTextDivSecondary.innerHTML = "<p>Your savings come from: <span class=\"highlightText\">$"+Math.round(endSavingsDirect).toLocaleString()+"</span> in direct fees that the robo-advisor would have charged you, and <span class=\"highlightText\">$"+Math.round(endSavingsIndirect).toLocaleString()+"</span> in investment returns that you'd have lost from paying those fees.</p>"+"<p>You'll save <span class=\"highlightText\">"+Math.round(endPercentLost*10)/10+"%</span> of your portfolio.</p>"+"<p>You'll spend a total of <span class=\"highlightText\">"+numYearsValue*annualHoursSpentValue+"</span> hours managing your DIY investment portfolio, meaning that you'll save <span class=\"highlightText\">$"+(Math.round(endHourlyRate*100)/100).toLocaleString()+"</span> per hour spent.</p>";

    //draw total portfolio value bar chart
    var ctx = outputBarChart.getContext('2d');

    chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'bar',
    
        // The data for our dataset
        data: {
            labels: ["DIY","Robo-Advisor"],
            datasets: [
                {
                    data: [endDIYPortfolioValue,endRoboPortfolioValue],
                    backgroundColor: ['rgb(0, 183, 255)','rgb(207, 0, 167)'], 
                    borderWidth:2,
                    borderColor: ['rgb(0, 103, 144)','rgb(133, 0, 108)'],
                },                
            ]
        },
    
        //options for annual returns chart.js bar chart
        options: outputBarChartOptions = {

            plugin_one_attribute: 1,
            maintainAspectRatio: false,

            tooltips: {
                // Include a dollar sign in the ticks and add comma formatting
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';

                        if (label) {
                            label += ': ';
                        }
                        label += "$"+(Math.round(tooltipItem.yLabel)).toLocaleString();
                        return label;
                    }
                },
            },
            
            scales: {
                yAxes: [{
                    scaleLabel: {
                        fontColor: "rgb(56,56,56)",
                        fontStyle: "bold",
                        fontSize: 13,
                    },

                    ticks: {
                        fontColor: "rgb(56,56,56)",

                        maxTicksLimit:8,
                        max: Math.ceil(endDIYPortfolioValue*1.1/100000)*100000,
                        min: Math.floor(endRoboPortfolioValue*0.9/100000)*100000,

                        callback: function(value, index, values) {
                            return "$"+value.toLocaleString();
                        },
                    },

                    gridLines: {
                        zeroLineColor: "rgb(56,56,56)",
                        zeroLineWidth: 2,
                    },
                }],

                xAxes: [{
                    
                    ticks: {
                        autoSkip: false,
                        fontSize: 12,
                        fontColor: "rgb(56,56,56)",
                    },

                    scaleLabel: {
                        display: true,
                        fontColor: "rgb(56,56,56)",
                        fontStyle: "bold",
                        fontSize: 13,
                    },

                    gridLines: {
                        zeroLineColor: "rgb(56,56,56)",
                        zeroLineWidth: 2,
                    },
                }],    
            },

            legend: {
                display: false
            },

            title: {
                display: true,
                text: "Portfolio at Year "+numYearsValue,
                fontSize: 15,
                fontColor: "rgb(56,56,56)",
                padding: 8,
            },
        }
    });


    //draw detailed chart of portfolio value over time
    var ctx2 = fullChart.getContext('2d');

    chart2 = new Chart(ctx2, {
        // The type of chart we want to create
        type: 'line',
    
        // The data for our dataset
        data: {
            labels: yearArray,
            datasets: [
                {
                    label: "DIY",
                    borderColor: 'rgb(0, 183, 255)',
                    pointBackgroundColor: 'rgb(0, 183, 255)',
                    fill: false,
                    data: diyPortfolioArray,
                    pointHitRadius: 7,
                },
    
                {
                    label: "Robo-Advisor",
                    borderColor: 'rgb(207, 0, 167)',
                    pointBackgroundColor: 'rgb(207, 0, 167)',
                    fill: false,
                    data: roboPortfolioArray,
                    pointHitRadius: 7,
                },
            ]
        },
    
        // Configuration options go here
        options: {
            maintainAspectRatio: false,
        
            tooltips: {
                 // Include a dollar sign in the ticks and add comma formatting
                 callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';
    
                        if (label) {
                            label += ': ';
                        }
                        label += '$'+Math.round(tooltipItem.yLabel).toLocaleString();
                        return label;
                    }
                },
            },
    
            scales: {
                yAxes: [{
                    ticks: {
                        // Include a dollar sign in the ticks and add comma formatting
                        callback: function(value, index, values) {
                            return '$' + value.toLocaleString();
                        },

                        fontColor: "rgb(56,56,56)",
                    },
    
                    scaleLabel: {
                        fontColor: "rgb(56,56,56)",
                        fontStyle: "bold",
                        fontSize: 15,
                    },

                    gridLines: {
                        drawTicks: false,
                        zeroLineColor: "rgb(56,56,56)",
                        zeroLineWidth: 2,
                    },
                }],
    
                xAxes: [{
                    ticks: {
                        userCallback: function(item, index) {
                            if (!(index % 5)) return item;
                         },
                         autoSkip: false,
                         fontColor: "rgb(56,56,56)",

                        maxRotation: 0,
                        minRotation: 0, 
                    },
    
                    scaleLabel: {
                        display: true,
                        labelString: "# of Years from Today",
                        fontColor: "rgb(56,56,56)",
                        fontStyle: "bold",
                        fontSize: 15,
                    },

                    gridLines: {
                        drawTicks: false,
                        zeroLineColor: "rgb(56,56,56)",
                        zeroLineWidth: 2,
                    },
                }],    
            },
            
            legend: {
                labels: {
                    fontColor: "rgb(56,56,56)",
                    boxWidth: 13,
                    padding: 10,
                },
            },

            title: {
                display: true,
                text: "Portfolio Value Over Time",
                fontSize: 18,
                fontColor: "rgb(56,56,56)",
                padding: 2,
            },
        }
    });

}


function generateArrays(){

    //set values back to default
    endSavings = 0;
    endSavingsDirect = 0;
    endSavingsIndirect = 0;

    endDIYPortfolioValue = 0;
    endRoboPortfolioValue = 0;

    endHoursSpent = 0;
    endHourlyRate = 0;
    endPercentLost = 0;

    diyPortfolioArray = [];
    roboPortfolioArray = [];
    yearArray = [];

    cumDirectFees = 0;

    for(i=0; i<numYearsValue+1; i++){
        if(i==0){
            diyPortfolioArray[i] = startingPortfolioValue;
            roboPortfolioArray[i] = startingPortfolioValue;
        } else{
            diyPortfolioArray[i] = diyPortfolioArray[i-1] + annualSavingsValue + annualReturnValue/100 * diyPortfolioArray[i-1];
            roboPortfolioArray[i] = roboPortfolioArray[i-1] + annualSavingsValue + annualReturnValue/100 * roboPortfolioArray[i-1] - annualFeeValue/100 * roboPortfolioArray[i-1];
            cumDirectFees += annualFeeValue/100 * roboPortfolioArray[i-1];
        }

        yearArray[i] = i;

        console.log("DIY Portfolio at year "+i+": "+diyPortfolioArray[i]);
        console.log("Robo Portfolio at year "+i+": "+roboPortfolioArray[i]);


        if(i==numYearsValue){
            endDIYPortfolioValue = diyPortfolioArray[i];
            endRoboPortfolioValue = roboPortfolioArray[i];

            endSavings = endDIYPortfolioValue - endRoboPortfolioValue;;
            endSavingsDirect = cumDirectFees;
            endSavingsIndirect = endSavings - endSavingsDirect;

            endHoursSpent = numYearsValue * annualHoursSpentValue;
            endHourlyRate = endSavings / endHoursSpent;
            endPercentLost = endSavings / diyPortfolioArray[i] * 100;
        }
    }

}


function refreshChart(){
    console.log("refresh chart");
    chart.destroy();
    chart2.destroy();
    getUserInputs();
    showOutputs();
}

