# Soldata Garbia

Calculadora de salario neto para el Territorio Histórico de Álava, con retención de IRPF y
cotizaciones a la Seguridad Social configurables por una persona administradora.

**En producción:** https://soldata-garbia.web.app

## Español

Soldata Garbia calcula el sueldo neto mensual y anual a partir del salario bruto anual, según:

- **Número de pagas** (12 o 14).
- **Número de descendientes a cargo**, que reduce el tipo de retención de IRPF.
- **Tipo de contrato** (indefinido o temporal), que afecta a la cotización por desempleo.
- **Grado de discapacidad reconocido**, que da derecho a una minoración adicional del IRPF.

El resultado incluye el desglose completo: retención de IRPF, y cada partida de la cotización a
la Seguridad Social (contingencias comunes, desempleo, formación profesional y MEI).

Quien inicia sesión puede consultar su historial de cálculos guardados. La primera cuenta que se
registra se convierte automáticamente en administradora.

### Configuración de cálculo (solo administración)

Sin necesidad de tocar código ni desplegar de nuevo, una persona administradora puede editar en
directo desde la propia aplicación:

- La **tabla de retención de IRPF** (tramos por retribución anual y número de descendientes) y la
  **tabla de minoración por discapacidad**, tramo a tramo, incluyendo añadir o eliminar tramos.
- Un **porcentaje de IRPF fijo** y unos **puntos de minoración fijos**, opcionales e
  independientes de las tablas anteriores, para casos en los que se quiera aplicar un valor
  concreto sin tocar la tabla completa.
- Las **tasas de cotización a la Seguridad Social** (base máxima mensual, contingencias comunes,
  desempleo para contrato indefinido y temporal, formación profesional y MEI).

## Euskara

Soldata Garbiak hileko eta urteko soldata garbia kalkulatzen du urteko soldata gordinetik
abiatuta, honako hauen arabera:

- **Pagen kopurua** (12 edo 14).
- **Ardurapeko ondorengoen kopurua**, PFEZ atxikipen-tipoa murrizten duena.
- **Kontratu mota** (mugagabea edo aldi baterakoa), langabezia-kotizazioan eragina duena.
- **Aitortutako desgaitasun maila**, PFEZ murrizketa gehigarri bat ematen duena.

Emaitzak xehetasun osoa erakusten du: PFEZ atxikipena, eta Gizarte Segurantzako kotizazioaren
kontzeptu bakoitza (kontingentzia arruntak, langabezia, lanbide-heziketa eta MEI).

Saioa hasten duenak bere gordetako kalkuluen historia ikus dezake. Erregistratzen den lehen
kontua automatikoki bihurtzen da administratzaile.

### Kalkulu-konfigurazioa (administraziorako soilik)

Kodea ukitu edo berriz zabaldu beharrik gabe, administratzaile batek zuzenean editatu ditzake
aplikaziotik bertatik:

- **PFEZ atxikipen-taula** (urteko errenta eta ondorengo kopuruaren araberako tarteak) eta
  **desgaitasunagatiko murrizketa-taula**, tarteka, tarteak gehituz edo ezabatuz.
- **PFEZ ehuneko finko** bat eta **murrizketa-puntu finkoak**, aukerakoak eta aurreko tauletatik
  independienteak, taula osoa ukitu gabe balio zehatz bat aplikatu nahi denerako.
- **Gizarte Segurantzako kotizazio-tasak** (hileko gehieneko basea, kontingentzia arruntak,
  langabezia kontratu mugagabe eta aldi baterakoarentzat, lanbide-heziketa eta MEI).
