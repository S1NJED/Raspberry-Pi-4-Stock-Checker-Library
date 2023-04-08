# Raspberry-Pi-4-Stock-Checker-Library

### A simple javascript library to check stock of the Raspberry Pi 4 Model B.

This library **scrap** the *public data* from official stores of many countries like:
  
  - 🇫🇷 France
  - More soon ... (🏴󠁧󠁢󠁥󠁮󠁧󠁿, 🇺🇸, ...)
 


<h3>Prerequisite</h3>
<p>Install <a href="https://nodejs.org/en/download" target="_blank">Node.js</a>

<h2>Documentation</h2>

<ul>
  <li><kbd>RaspberryPiNotif</kbd> (class)</li>
  <ul>
    <li><kbd>storesNames</kbd> (property) - Array of all available stores names</li>
    <li><kbd>checkStock</kbd> (method) - Check stock from a single store</li>
      <ul>
        <li><kbd>storeName</kbd> (string) - Name of the store to check his stock</li>
        <li><kbd>gb</kbd> (number) - OPTIONAL, Ram size of the raspberry Pi (2, 4 OR 8), if no gb given it will get information stock for every ram sizes</li>
        <li><kbd>delay</kbd> (number) - OPTIONAL, by default 500 ms, delay in ms between each requests</li>
        <li>@return - Array of objects that contains informations about the stock</li>    
      </ul>
    <li><kbd>checkStockGB</kbd> (method) - Check stock for the Raspberry Pi 4 X GB from every available stores.</li>
      <ul>
        <li><kbd>gb</kbd> (number) - Ram sizes of the Raspberry Pi you want to check</li>  
        <li>@return - Array of objects that contains informations about the stock</li>
      </ul>
  </ul>
</ul>


<hr>
Checking official stores from the <a href="https://www.raspberrypi.com/products/raspberry-pi-4-model-b/" target="_blank">Raspberry Pi Website</a> 
