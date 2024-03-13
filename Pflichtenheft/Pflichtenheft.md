# Pflichtenheft

## Beschreibung der Ausgangslage

* HTL Leonding
* Klasse: 3BHIF
* 3 Projektmitglieder

Es wird ein Projekt die Fächer "Systemplanung und Projektentwiklung" und "Webprogrammieren und Mobilecomputing" benötigt.

## Ist-Zustand

Wenn man schnell eine simple und schöne Website mit Documentation oder Code Highlighting machen will, dann muss man HTML
benutzten und mit CSS mühsam die Fonts und Colors verändern und Code Highlighting mit komischer Syntax implementieren.

## Zielsetzung

### Meilensteine
|Phase|Soll-Termin|Ergebnisse|
|-----|-----------|----------|
|Initiierung|13.03.2024         |Pflichtenheft und MockUps sind vollständig|vorhanden|
|Planung||Arbeitspakete sind festgelegt|
|Durchführung||Die API kann benutzt werden um Benutzer zu erstellen und zu verwalten|
|Durchführung||Die API kann benutzt weden um Themes zu erstellen und zu zu verwalten|
|Durchführung||Die API kann beutzt werden um Projekte zu erstellen und verwalten|
|Durchführung||Die API kann benutzt werden um eine statische Website eines Projektes zu generieren und zu bekommen|
|Durchführung||Es können Projekte eines Benutzers mithilfe des Frontends verwaltet werden|
|Durchführung||Themes können mithilfe des Frontends erstellt bearbeitet und verwaltet werden|
|Durchführung||Projekte können mithilfe des Frontends bearbeitet werden und eine Preview wird angezeigt|
|Durchführung||Die statisch generertie Website kann mithilfe des Frontends für jedes Projekt heruntergeladen werden|

## Soll-Zustand

Es gibt eine Website welche Markdown Files in eine statische Website konvertieren kann. Hierbei ist es möglich Designs auszuwählen und zu erstellen. Diese Designs können mit anderen Benutzern geteilt werden. Die statische Website kann als Projekt des Users auf unserer Website gespeichert werden. Für die statische Website kann automatisch eine Inhaltsangabe generieren.

* Projekte
  * erstellbar
  * löschbar
  * veränderbar  
* Übersicht in Projekten
  * Es können mehrere Markdown Files hochgeladen werden
  * Prieview für das ausgewählte File
  * Es kann ein Markdown File zur Startseite gemacht werden
  * Ein Inhaltsverzeichnis kann für jede der Seiten generiert werden
  * Es kann ein Theme ausgewählt werden, von welchem die Daten geladen werden
    * Dies ermöglicht die Bearbeitung von Themes anderer Nutzer
* Themes
  * erstellbar
  * löschbar
  * teilbar mit anderen Benutzern
  * bearbeitbar
  * Themes anderer Benutzer können nachträglich für sich bearbeitet werden
  * durch das löschen geteilter Themes werden sie für andere Benutzer auch gelöscht

Für alle genannten Funktionen wird ein Account benötigt.

### MockUp
![MockUp](MockUp.png)

### Verwendete Technologien
* Frontend
  * HTML
  * CSS
  * Typescript
* Backend
  * Typescript
  * Express
  * NodeJS

## Mengengerüst

Da es ein Schulprojekt ist, wird mit allerhöchstens 100 Aufrufen in der Stunde gerechnet.