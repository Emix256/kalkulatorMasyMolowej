let atomowaMasaLista = {};
let elementySelect = [];

// Funkcja do ładowania danych z pliku JSON
async function ladowanieMasyMolowej() {
    try {
        const odp = await fetch('pierwiastki.json');
        atomowaMasaLista = await odp.json();
        elementySelect = Object.keys(atomowaMasaLista);
        dodajOpcjeSelect();
    } catch (error) {
        console.error('Błąd podczas ładowania danych:', error);
    }
}

// Funkcja do wypełniania listy pierwiastków
function dodajOpcjeSelect() {
    const select = document.getElementById('opcje');
    elementySelect.forEach(element => {
        const opcja = document.createElement('option');
        opcja.value = element;
        opcja.textContent = element;
        select.appendChild(opcja);
    });
}

// Funkcja do dodawania wybranego pierwiastka do wzoru chemicznego
function dodajOpcjeDoInputa() {
    const select = document.getElementById('opcje');
    const wybranyElement = select.value;
    if (wybranyElement) {
        const daneUzytkownika = document.getElementById('zwiazek');
        daneUzytkownika.value += wybranyElement; 
        select.value = ''; 
    }
}

// Funkcja do obliczania masy molowej i składu procentowego
function obliczMaseMolowa() {
    const zwiazek = document.getElementById('zwiazek').value;
    let totalnaMasa = 0;
    const iloscElementow = {};
    const regex = /([A-Z][a-z]*)(\d*)/g;
    let dopasowanie;

    while ((dopasowanie = regex.exec(zwiazek)) !== null) {
        const element = dopasowanie[1];
        const ilosc = dopasowanie[2] ? parseInt(dopasowanie[2]) : 1;
        const atomowaMasa = atomowaMasaLista[element];

        if (atomowaMasa) {
            totalnaMasa += atomowaMasa * ilosc;
            iloscElementow[element] = (iloscElementow[element] || 0) + ilosc;
        } else {
            alert(`Coś źle wpisałeś/aś w wzorze chemicznym`);
            return;
        }
    }

    document.getElementById('wynik').innerText = `Masa molowa: ${totalnaMasa.toFixed(2)} g/mol`;
    wyswietlProcenty(iloscElementow, totalnaMasa);
}

// Funkcja do wyświetlania składu procentowego
function wyswietlProcenty(iloscElementow, totalnaMasa) {
    let zwiazekText = 'Skład procentowy:<br>'; 
    for (const element in iloscElementow) {
        const ilosc = iloscElementow[element];
        const atomowaMasa = atomowaMasaLista[element];
        const masa = atomowaMasa * ilosc;
        const procenty = (masa / totalnaMasa) * 100;
        zwiazekText += `${element}: ${procenty.toFixed(2)}%<br>`; 
    }
    document.getElementById('wynikProcentowy').innerHTML = zwiazekText;
}


// Funkcja do obsługi naciśnięcia klawisza Enter
document.getElementById('zwiazek').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        obliczMaseMolowa(); 
    }
});


window.onload = ladowanieMasyMolowej;