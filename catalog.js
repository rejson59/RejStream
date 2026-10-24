// Sources and verification notes: SOURCES.md. Null IDs deliberately mean external-only.
const episode=(season,number,title,id,minutes,desc,pl)=>({season,number,title,id,time:`${minutes} min`,desc,pl});
export const helluvaEpisodes=[
 episode(1,1,'Murder Family','el_PChGfJN8',13,'Pierwsze zlecenie, rodzinne sekrety i kompletny chaos.','4DjfKP5w8Ps'),
 episode(1,2,'Loo Loo Land','kpnwRg268FQ',16,'Rodzinna wycieczka do parku rozrywki z ekipą I.M.P.'),
 episode(1,3,'Spring Broken','RghsgkZKedg',17,'Powrót byłej dziewczyny Blitzø kończy się rywalizacją.'),
 episode(1,4,'C.H.E.R.U.B.','1ZFseYPmkAk',15,'Anielska konkurencja wkracza do akcji.'),
 episode(1,5,'The Harvest Moon Festival','h2ZmVAdezF8',18,'Święto w Kręgu Gniewu i spotkanie ze Strikerem.'),
 episode(1,6,'Truth Seekers','yXErLiSbxXQ',22,'Blitzø i Moxxie wpadają w ręce łowców demonów.'),
 episode(1,7,"Ozzie’s",'8zyGQquL8VM',17,'Wieczór w klubie Asmodeusza nie idzie zgodnie z planem.'),
 episode(1,8,'Queen Bee','D-2799Y07Zc',16,'Loona i Blitzø trafiają na piekielnie głośną imprezę.'),
 episode(2,1,'The Circus','_spuxXnul0U',23,'Powrót do dzieciństwa Stolasa i Blitzø.'),
 episode(2,2,'Seeing Stars','4J0xFUyz1nw',21,'Octavia zabiera grymuar i wyrusza do Los Angeles.'),
 episode(2,3,'Exes and Oohs','j1BfO7VlIw4',25,'Moxxie wraca do rodzinnego domu i swojej przeszłości.'),
 episode(2,4,'Western Energy','KJy7T24rhg0',19,'Stolas zostaje porwany. Ekipa rusza na ratunek.'),
 episode(2,5,'Unhappy Campers','lYu1ysDULwA',21,'Moxxie po raz pierwszy samodzielnie prowadzi misję.'),
 episode(2,6,'Oops','y1sF6ZeASU0',27,'Blitzø i Fizzarolli muszą wspólnie wydostać się z pułapki.'),
 episode(2,7,"Mammon’s Magnificent Musical Mid-Season Special",'rRymSi8SmqA',30,'Fizzarolli staje na scenie konkursu organizowanego przez Mammona.'),
 episode(2,8,'The Full Moon','Fj9YRsV1pEw',23,'Spotkanie podczas pełni zmienia relację Blitzø i Stolasa.'),
 episode(2,9,'Apology Tour','tLD-OUkYtk4',22,'Nie każdą relację da się naprawić jednym przepraszam.'),
 episode(2,10,'Ghostf**kers','5DV4IIKwqRI',27,'Hotel, duchy i misja, która szybko staje się osobista.'),
 episode(2,11,'Mastermind','IoVB5Hn2m_k',22,'I.M.P. staje przed sądem, a stawka nigdy nie była wyższa.'),
 episode(2,12,'Sinsmas','GisSNuVpbkM',29,'Świąteczny finał drugiego sezonu.'),
 ...['Turtle Emoji','Bad Reputation','Gimpy Gimpy','A Trial of Errors','The Auction'].map((title,i)=>({...episode(3,i+1,title,null,'—','Odcinek katalogowy. Sprawdź dostępność i języki w Prime Video.'),time:'Prime Video',external:'https://www.primevideo.com/search/ref=atv_nb_sr?phrase=Helluva%20Boss'})),
 episode('special',1,'Pilot (2019)','OlahNrlcgS4',11,'Oryginalny pilot; osobny od aktualnego kanonu.','Fv8Zld0d_Qg'),
 episode('special',2,'Mission: Zero','Pu12or7uOHE',26,'Nowy punkt startowy historii I.M.P.'),
 episode('shorts',1,"Hell’s Belles",'_38dtqdR5V4',5,'Krótka historia z piekielnego uniwersum.'),
 episode('shorts',3,'Mission: Weeaboo-boo','3-NrCcr8Bcg',4,'Krótka misja I.M.P.'),
 episode('shorts',4,'Mission: Chupacabras','pngogrW4iC4',4,'Kolejne nietypowe zlecenie.')
];
export const extras=[
 {key:'circus',title:'The Amazing Digital Circus',type:'series',id:'HwAPLk_sQ3w',tag:'PILOT · GLITCH',desc:'Pomni trafia do cyfrowego świata, z którego nie potrafi się wydostać.',polish:'Ścieżki audio, w tym polska: sprawdź w ustawieniach YouTube. Katalog zawiera pilot, nie cały serial.'},
 {key:'drones',title:'Murder Drones',type:'series',id:'mImFz8mkaHo',tag:'PILOT · GLITCH',desc:'Mroczne science fiction, zbuntowane roboty i nieoczekiwany sojusz.',polish:'Dostępne języki sprawdzisz w ustawieniach YouTube. Katalog zawiera pilot, nie cały serial.'},
 {key:'bunny',title:'Big Buck Bunny',type:'movie',tag:'CAŁY FILM · CC BY 3.0',desc:'Spokojny królik ma dość złośliwych sąsiadów. Otwarty film Blender Foundation.',src:'https://uploads.video-commander.com/sample/BigBuckBunny.mp4',credit:'© 2008 Blender Foundation / www.bigbuckbunny.org · CC BY 3.0. Bez zmian; z napisami końcowymi. Mirror: Video Commander.',license:'https://peach.blender.org/about/',source:'https://peach.blender.org/download/',polish:'Film bez dialogów. Dubbing nie jest potrzebny.'}
];
export function selectEpisodes({season='all',query='',filter='all',savedOnly=false,saved=false}={}){
 if(savedOnly&&!saved)return [];
 return helluvaEpisodes.filter(e=>(season==='all'||String(e.season)===String(season))&&(`helluva boss ${e.title}`.toLocaleLowerCase('pl').includes(query.toLocaleLowerCase('pl')))&&(filter!=='pl'||!!e.pl));
}
export function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
