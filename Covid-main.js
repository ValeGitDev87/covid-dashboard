fetch('https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json')
.then(response => response.json())
.then(dati => {
    // dati riordinati per data ultima 
    let sorted = dati.reverse()
    
    //   preso e  riordinato per data 
    let lastUpdated = sorted[0].data
   
   
    
    //   data riformattata :12/06/2020
    let lastUpdatedFormatted = lastUpdated .split("T")[0].split("-").reverse().join("/");      
    
    
    //   mostrata data dom
    document.querySelector('#data').innerHTML = lastUpdatedFormatted;
    
    // elementi filtrati per  ultima data nel senso  per giorno e avremmo tutte le regioni 
    let lastUpdatedData = sorted.filter( el => el.data == lastUpdated)
     
   
    //  elementi riordinati in maniera decrescente  per nuovi positivi 
    let nuoviPositivi = lastUpdatedData.sort((a,b) => (b.nuovi_positivi - a.nuovi_positivi));
    
    
    
    // elemnti ciclati e rimessi in un nuovo array per totali casi poi la somma di essi 
    let totalCase = lastUpdatedData.map(el => el.totale_casi).reduce((a,b) => a+b);
    //   mostra totalcases
    document.querySelector('#totCases').innerHTML = totalCase;
    
    // totale guariti
    let totalRecovered = lastUpdatedData.map(el => el.dimessi_guariti).reduce((a,b)=> a+b);
    document.querySelector('#totRecovered').innerHTML = totalRecovered;
    
    
    // totale morti 
    let totalDead = lastUpdatedData.map(el => el.deceduti).reduce((a,b)=> a+b);
    document.querySelector("#totDecessi").innerHTML = totalDead
    
    // totale positivi piu la reduce 
    let totalPositiv = lastUpdatedData.map(el => el.totale_positivi).reduce((a,b)=>a+b);
    document.querySelector('#posAttuali').innerHTML = totalPositiv
    
    // creaziene delle card dinamiche 
    
    let cardWrapper = document.querySelector('#card-wrapper')
    let progresWrapper = document.querySelector('#progressBar')
    
    // valore massimo dei nuovi positivi esso è la laobradia 
    let barMax = Math.max(...lastUpdatedData.map(el => el.nuovi_positivi));
    
    // per creare le  modali dinamiche, dobbiamo aggiungere un attributo al div delle card, con valore : richiamando l'array
    // denominazione_regione esso è il valore unovoco della promise 
    
    lastUpdatedData.forEach(el => {
        
        let div = document.createElement('div')
        div.classList.add('col-12','col-md-5','my-5')
        div.innerHTML = `
        <div class="card-custom p-3 pb-0 h-100" data-region="${el.denominazione_regione}">
        <p class="text-center">${el.denominazione_regione}:</p>
        <p class="text-end h5 mb-0 p-2 text-main">${el.nuovi_positivi}</p>
        </div>
        `
        cardWrapper.appendChild(div);
        
        let bar = document.createElement('div')
        bar.classList.add('col-12', 'mb-5')
        bar.innerHTML = `
        <p class="mb-0">${el.denominazione_regione}:</p>
        <div class="progress bg-transparen rounded-0">
        <div class="progress-bar bg-main" style="width:${90*el.nuovi_positivi/barMax}%"></div>
        </div>
        <p class="text-end h5 mb-0 p-2 text-main">${el.nuovi_positivi}</p>
        
        
        `
        // alla riga 64 appiamo reso la progres bar dinamica (vedi riga 45)
        
        progresWrapper.appendChild(bar)
        
        
        
        
        
    });
    
    let modal = document.querySelector('.modal-custom');
    let modalContent = document.querySelector('.modal-custom-content');
    
    // catturato l'attributo dinamimco , e per ogni elmento,  cliaccato (el.addEvent) ascolta il click  e fai la funzione (dataset)
    // messa in una variabile per poi stamparla 
    document.querySelectorAll('[data-region').forEach(el =>{
        //  poi per ogni elemneto ascolta il suo click e fai partire una funzione che dichiara let region , che sarò
        //  il suo data set e aggiungi a modla la classe active che attiverà quella del css
        el.addEventListener('click',()=>{
            
            let region = el.dataset.region
            modal.classList.add('active')
            // e lavariabile dove diciamo al forEach  da dove prendere i dati , ovviamente in posizione
            let dataAboutRegion = lastUpdatedData.filter(el => el.denominazione_regione === region)[0]
            console.log(dataAboutRegion);
            
            modalContent.innerHTML = `
            
            <div class="container">
            <div class="row">
            <div class="col-12">
            <p class="h2 fw-bold lead text-main">${dataAboutRegion.denominazione_regione}</p>
            </div>
            <div class="col-12">
            <p class="h3 lead text-main"> <span>totale casi</span> : ${dataAboutRegion.totale_casi}</p>
            <p class="h3 lead text-main"> <span>Nuovi positivi</span>  :${dataAboutRegion.nuovi_positivi}</p>
            <p class="h3 lead text-main"> <span>Decessi</span>  :${dataAboutRegion.deceduti}</p>
            <p class="h3 lead text-main"> <span>guariti</span>  :${dataAboutRegion.dimessi_guariti}</p>
            <p class="h3 lead text-main"> <span>Ricoverati con sintomi</span>:${dataAboutRegion.ricoverati_con_sintomi}</p>
            <p class="h3 lead text-main"> <span>Terapia Intensiva</span> : ${dataAboutRegion.terapia_intensiva}</p>
            
            </div>
            </div>
            
            
            `
            
            let trendData = sorted.map(el => el).reverse().filter(el => el.denominazione_regione == region).map(el=> [el.data, el.nuovi_positivi, el.deceduti,el.dimessi_guariti])
            
            let maxNew = Math.max(...trendData.map(el=> el[1]))
            let maxDeath = Math.max(...trendData.map(el=> el[2]))
            let maxRecovered = Math.max(...trendData.map(el=> el[3]))
            
            console.log();
            let trendNew = document.querySelector('#trendNew');
            let trendDeath = document.querySelector('#trendDeath');
            let trendRecovered = document.querySelector('#trendRecovered');

            trendData.forEach(el => {

                let colNew = document.createElement('div')
                colNew.classList.add('d-inline-block','pin-new')
                colNew.style.height = `${100* el[1] / maxNew}%`
                trendNew.appendChild(colNew)
               


                let colDeath = document.createElement('div')
                colDeath.classList.add('d-inline-block', 'pin-death')
                colDeath.style.height = `${100 * el[2] / maxDeath}%`
                trendDeath.appendChild(colDeath)

                let colRecovered = document.createElement('div')
                colRecovered.classList.add('d-inline-block', 'pin-recovered')
                colRecovered.style.height = `${100 * el[3] / maxRecovered}%`
                trendRecovered.appendChild(colRecovered)
                
            });



            
        });
        
        
        
        
        
        
        
        //  diciamo a window(finestra generale ) ascolta l'evento 'click' e fai partire la funzione con un parametro formale che sarà l'elemento 
        //  cliccato in quel momento e se è esso è uguale a modal (ovvero attivo), allora rimuovi la classe 
        window.addEventListener('click', function(a){
            
            if(a.target == modal){
                modal.classList.remove('active')
            }
            
            
        })
        
    })
    
    
    
})
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
