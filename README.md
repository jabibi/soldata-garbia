# Soldata Garbia

Calculadora de salario neto para Araba, Bizkaia, Gipuzkoa, Nafarroa y el resto de España, con
retención de IRPF y cotizaciones a la Seguridad Social configurables por una persona
administradora.

**En producción:** https://soldata-garbia.web.app

Soldata Garbia calcula el sueldo neto mensual y anual a partir del salario bruto anual, según:

- **Territorio** (Araba, Bizkaia, Gipuzkoa, Nafarroa o resto de España), que determina la tabla de
  retención de IRPF aplicable. Los cuatro primeros tienen su propia tabla foral, verificada y
  admin-editable; el resto de España se calcula con el procedimiento general de la Agencia
  Tributaria, ya que no existe una tabla oficial equivalente.
- **Número de pagas** (12 o 14).
- **Número de descendientes a cargo**, que reduce el tipo de retención de IRPF.
- **Tipo de contrato** (indefinido o temporal), que afecta a la cotización por desempleo.
- **Grado de discapacidad reconocido**, que da derecho a una minoración adicional del IRPF.
- **Porcentaje de IRPF manual** (opcional), por si ya conoces tu tipo de retención real y quieres
  usarlo directamente en el cálculo.

El resultado incluye el desglose completo: retención de IRPF, y cada partida de la cotización a
la Seguridad Social (contingencias comunes, desempleo, formación profesional y MEI).

Quien inicia sesión puede consultar su historial de cálculos guardados. La primera cuenta que se
registra se convierte automáticamente en administradora.

### Configuración de cálculo (solo administración)

Sin necesidad de tocar código ni desplegar de nuevo, una persona administradora puede editar en
directo desde la propia aplicación, por separado para cada uno de los cuatro territorios forales
(Araba, Bizkaia, Gipuzkoa, Nafarroa):

- La **tabla de retención de IRPF** (tramos por retribución anual y número de descendientes) y la
  **tabla de minoración por discapacidad**, tramo a tramo, incluyendo añadir o eliminar tramos.
- Las **tasas de cotización a la Seguridad Social** (base máxima mensual, contingencias comunes,
  desempleo para contrato indefinido y temporal, formación profesional y MEI) — estas sí son
  únicas y compartidas por los cinco territorios, al ser de ámbito estatal.

El territorio "resto de España" no tiene tabla editable, al calcularse con un algoritmo fijo en
vez de una tabla de tramos.

## Euskara

Soldata Garbiak hileko eta urteko soldata garbia kalkulatzen du urteko soldata gordinetik
abiatuta, honako hauen arabera:

- **Lurraldea** (Araba, Bizkaia, Gipuzkoa, Nafarroa edo Espainiako gainerakoa), PFEZ atxikipen-
  taula zehazten duena. Lehen lauek beren foru-taula propioa dute, egiaztatua eta administraziotik
  editagarria; Espainiako gainerakoa Zerga Agentziaren prozedura orokorrarekin kalkulatzen da,
  taula ofizial baliokiderik ez dagoelako.
- **Paga kopurua** (12 edo 14).
- **Ardurapeko ondorengoen kopurua**, PFEZ atxikipen-tipoa murrizten duena.
- **Kontratu mota** (mugagabea edo aldi baterakoa), langabezia-kotizazioan eragina duena.
- **Aitortutako desgaitasun maila**, PFEZ murrizketa gehigarri bat ematen duena.
- **PFEZ ehuneko eskuzkoa** (aukerakoa), zure benetako atxikipen-tipoa jada ezagutzen baduzu eta
  zuzenean kalkuluan erabili nahi baduzu.

Emaitzak xehetasun osoa erakusten du: PFEZ atxikipena, eta Gizarte Segurantzako kotizazioaren
kontzeptu bakoitza (gertakari arruntak, langabezia, lanbide-prestakuntza eta MEI).

Saioa hasten duenak bere gordetako kalkuluen historia ikus dezake. Erregistratzen den lehen
kontua automatikoki bihurtzen da administratzaile.

### Kalkulu-konfigurazioa (administraziorako soilik)

Kodea ukitu edo berriz zabaldu beharrik gabe, administratzaile batek zuzenean editatu ditzake
aplikaziotik bertatik, foru-lurralde bakoitzeko bereizita (Araba, Bizkaia, Gipuzkoa, Nafarroa):

- **PFEZ atxikipen-taula** (urteko errenta eta ondorengo kopuruaren araberako tarteak) eta
  **desgaitasunagatiko murrizketa-taula**, tarteka, tarteak gehituz edo ezabatuz.
- **Gizarte Segurantzako kotizazio-tasak** (hileko gehieneko basea, kontingentzia arruntak,
  langabezia kontratu mugagabe eta aldi baterakoarentzat, lanbide-prestakuntza eta MEI) — hauek
  bost lurraldeen artean bakarrak eta partekatuak dira, estatu-mailakoak baitira.

"Espainiako gainerakoa" lurraldeak ez du taula editagarririk, algoritmo finko batekin kalkulatzen
delako, tarte-taula batekin ez bezala.
