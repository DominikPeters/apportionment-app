export const census2020 = {"AL": 5024279, "AK": 733391, "AZ": 7151502, "AR": 3011524, "CA": 39538223, "CO": 5773714, "CT": 3605944, "DE": 989948, "FL": 21538187, "GA": 10711908, "HI": 1455271, "ID": 1839106, "IL": 12812508, "IN": 6785528, "IA": 3190369, "KS": 2937880, "KY": 4505836, "LA": 4657757, "ME": 1362359, "MD": 6177224, "MA": 7029917, "MI": 10077331, "MN": 5706494, "MS": 2961279, "MO": 6154913, "MT": 1084225, "NE": 1961504, "NV": 3104614, "NH": 1377529, "NJ": 9288994, "NM": 2117522, "NY": 20201249, "NC": 10439388, "ND": 779094, "OH": 11799448, "OK": 3959353, "OR": 4237256, "PA": 13002700, "RI": 1097379, "SC": 5118425, "SD": 886667, "TN": 6910840, "TX": 29145505, "UT": 3271616, "VT": 643077, "VA": 8631393, "WA": 7705281, "WV": 1793716, "WI": 5893718, "WY": 576851};

export const trashIcon = `<span class="trash"><svg aria-hidden="true" focusable="false" data-prefix="far"
data-icon="trash-can" class="svg-inline--fa fa-trash-can" role="img"
xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
<path fill="currentColor"
    d="M432 80h-82.38l-34-56.75C306.1 8.827 291.4 0 274.6 0H173.4C156.6 0 141 8.827 132.4 23.25L98.38 80H16C7.125 80 0 87.13 0 96v16C0 120.9 7.125 128 16 128H32v320c0 35.35 28.65 64 64 64h256c35.35 0 64-28.65 64-64V128h16C440.9 128 448 120.9 448 112V96C448 87.13 440.9 80 432 80zM171.9 50.88C172.9 49.13 174.9 48 177 48h94c2.125 0 4.125 1.125 5.125 2.875L293.6 80H154.4L171.9 50.88zM352 464H96c-8.837 0-16-7.163-16-16V128h288v320C368 456.8 360.8 464 352 464zM224 416c8.844 0 16-7.156 16-16V192c0-8.844-7.156-16-16-16S208 183.2 208 192v208C208 408.8 215.2 416 224 416zM144 416C152.8 416 160 408.8 160 400V192c0-8.844-7.156-16-16-16S128 183.2 128 192v208C128 408.8 135.2 416 144 416zM304 416c8.844 0 16-7.156 16-16V192c0-8.844-7.156-16-16-16S288 183.2 288 192v208C288 408.8 295.2 416 304 416z">
</path>
</svg></span>`;

export const methodDescriptions = {
    "hamilton" : {
        h2 : "Hamilton's Method / Largest Remainder Method",
        details : "A method that assigns each party its lower quota, and then assigns remaining seats in order of highest remaining fractional quota.",
        links : {
            "Wikipedia": "https://en.wikipedia.org/wiki/Largest_remainder_method"
        }
    },
    "dhondt" : {
        h2 : "D'Hondt's Method / Jefferson's Method",
        details : "The unique divisor method that satisfies lower quota.",
        links : {
            "Wikipedia": "https://en.wikipedia.org/wiki/D%27Hondt_method"
        }
    },
    "saintelague" : {
        h2 : "Sainte Laguë Method / Webster's Method",
        details : "A divisor method based on standard rounding.",
        links : {
            "Wikipedia": "https://en.wikipedia.org/wiki/Webster/Sainte-Lagu%C3%AB_method"
        }
    },
    "adams" : {
        h2 : "Adam's Method",
        details : "",
        links : {
            "Wikipedia": "https://en.wikipedia.org/wiki/Highest_averages_method#Adams's_method"
        }
    },
    "dean" : {
        h2 : "Dean's Method",
        details : "",
        links : {}
    },
    "huntington" : {
        h2 : "Huntington&ndash;Hill Method",
        details : "A divisor method used in apportioning the seats of the House of Representatives of the United States.",
        links : {
            "Wikipedia": "https://en.wikipedia.org/wiki/Huntington%E2%80%93Hill_method"
        }
    },
    "quota" : {
        h2 : "Balinski&ndash;Young Quota Method",
        details : "A variation of the D'Hondt/Jefferson method that satisfies quota while still being house monotonic (i.e., avoiding the Alabama paradox).",
        links : {}
    }
}

// export let color = ["#40a4d8", "#33beb7", "#b2c224", "#fecc2f", "#f8a227", "#f66320", "#db3937", "#ee6579", "#a364d9", "#d6cbd3", "#d1a5a8", "#bdcebe", "#A28F9D", "#FFE8D4", "#E3DAFF"];
export let color = ["#40a4d8", "#33beb7", "#b2c224", "#fecc2f", "#f8a227", "#f66320", "rgb(50,150,77)", "rgb(1,104,118)", "rgb(117,213,225)", "rgb(44,69,125)", "rgb(129,132,251)", "rgb(141,48,186)", "rgb(160,232,91)", "rgb(238,200,241)", "rgb(173,34,112)", "rgb(250,99,213)", "rgb(63,22,249)", "rgb(30,239,201)", "rgb(11,83,19)", "rgb(205,219,155)", "rgb(132,84,26)", "rgb(214,160,117)", "rgb(225,50,25)", "rgb(219,201,7)", "rgb(137,151,91)", "rgb(54,229,21)", "rgb(247,147,2)", "rgb(137,127,158)", "rgb(89,32,175)", "rgb(112,248,235)", "rgb(14,80,62)", "rgb(132,235,134)", "rgb(115,140,78)", "rgb(201,221,135)", "rgb(28,152,32)", "rgb(158,203,244)", "rgb(32,41,108)", "rgb(152,103,246)", "rgb(242,135,208)", "rgb(155,79,140)", "rgb(244,38,151)", "rgb(43,114,231)", "rgb(20,143,174)", "rgb(174,248,21)", "rgb(102,6,22)", "rgb(247,57,49)", "rgb(77,54,52)", "rgb(221,114,94)", "rgb(230,191,162)", "rgb(244,212,3)", "rgb(141,99,10)", "rgb(159,4,252)", "rgb(103,45,126)", "rgb(188,116,216)", "rgb(100,248,244)", "rgb(42,104,102)", "rgb(76,176,130)", "rgb(145,251,115)", "rgb(5,110,18)", "rgb(194,233,245)", "rgb(10,47,100)", "rgb(158,156,176)", "rgb(19,26,186)", "rgb(82,142,251)", "rgb(194,13,166)", "rgb(252,214,255)", "rgb(125,172,34)", "rgb(213,236,158)", "rgb(69,42,19)", "rgb(233,173,111)", "rgb(117,22,16)", "rgb(243,122,107)", "rgb(253,44,59)", "rgb(21,183,30)"];

var pSBCr;
const pSBC=(p,c0,c1,l)=>{
    let r,g,b,P,f,t,h,i=parseInt,m=Math.round,a=typeof(c1)=="string";
    if(typeof(p)!="number"||p<-1||p>1||typeof(c0)!="string"||(c0[0]!='r'&&c0[0]!='#')||(c1&&!a))return null;
    if(!pSBCr)pSBCr=(d)=>{
        let n=d.length,x={};
        if(n>9){
            [r,g,b,a]=d=d.split(","),n=d.length;
            if(n<3||n>4)return null;
            x.r=i(r[3]=="a"?r.slice(5):r.slice(4)),x.g=i(g),x.b=i(b),x.a=a?parseFloat(a):-1
        }else{
            if(n==8||n==6||n<4)return null;
            if(n<6)d="#"+d[1]+d[1]+d[2]+d[2]+d[3]+d[3]+(n>4?d[4]+d[4]:"");
            d=i(d.slice(1),16);
            if(n==9||n==5)x.r=d>>24&255,x.g=d>>16&255,x.b=d>>8&255,x.a=m((d&255)/0.255)/1000;
            else x.r=d>>16,x.g=d>>8&255,x.b=d&255,x.a=-1
        }return x};
    h=c0.length>9,h=a?c1.length>9?true:c1=="c"?!h:false:h,f=pSBCr(c0),P=p<0,t=c1&&c1!="c"?pSBCr(c1):P?{r:0,g:0,b:0,a:-1}:{r:255,g:255,b:255,a:-1},p=P?p*-1:p,P=1-p;
    if(!f||!t)return null;
    if(l)r=m(P*f.r+p*t.r),g=m(P*f.g+p*t.g),b=m(P*f.b+p*t.b);
    else r=m((P*f.r**2+p*t.r**2)**0.5),g=m((P*f.g**2+p*t.g**2)**0.5),b=m((P*f.b**2+p*t.b**2)**0.5);
    a=f.a,t=t.a,f=a>=0||t>=0,a=f?a<0?t:t<0?a:a*P+t*p:0;
    if(h)return"rgb"+(f?"a(":"(")+r+","+g+","+b+(f?","+m(a*1000)/1000:"")+")";
    else return"#"+(4294967296+r*16777216+g*65536+b*256+(f?m(a*255):0)).toString(16).slice(1,f?undefined:-2)
}

// color = color.map((c) => pSBC(-0.13, c));
export let lighterColors = {};
export let darkerColors = {};
for (var c of color) {
    lighterColors[c] = pSBC(0.15, c);
    darkerColors[c] = pSBC(-0.6, c);
}