// app/api/route.ts

import { NextResponse } from 'next/server';

const ACCOUNT_NUMBER = process.env.ACCOUNT_NUMBER;
const PASSWORD = process.env.PASSWORD;

if (!ACCOUNT_NUMBER || !PASSWORD) {
  throw new Error('Les variables ACCOUNT_NUMBER ou PASSWORD ne sont pas définies.');
}


export async function POST(request: Request) {
  const { recipient, parcelDetails } = await request.json();

  // Génération dynamique de la date et de l'heure actuelles - ERREUR : IL Y A DES DECALAGES DANS LES HEURES ET LES MOIS ! regarder plus tard
  const currentDate = new Date();
  // Génération de la date et de l'heure au format requis
  const shipDate = currentDate.toISOString().slice(0, 19); // Format YYYY-MM-DDTHH:MM:SS
  const shipHour = currentDate.getHours().toString().padStart(2, '0'); // Format HH (sur deux chiffres)

  // Ajout de 4 jours à la date actuelle - a ajuster avec Johan (je ne connais pas les dates de peremption)
  const datePeremption = new Date(currentDate);
  datePeremption.setDate(currentDate.getDate() + 4);

  // Formatage de la date en YYYY-MM-DD
  const expirationDate = datePeremption.toISOString().split('T')[0];

  // Affichage pour vérification
  console.log("shipDate:", shipDate);
  console.log("shipHour:", shipHour);
  console.log("expirationDate:", expirationDate);

  const soapRequest = `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:cxf="http://cxf.shipping.soap.chronopost.fr/">
      <soapenv:Header/>
      <soapenv:Body>
        <cxf:shippingMultiParcelV4>
          <headerValue>
            <accountNumber>${ACCOUNT_NUMBER}</accountNumber>
            <idEmit>CHRFR</idEmit>
            <identWebPro></identWebPro>
            <subAccount></subAccount>
          </headerValue>
          <shipperValue>
            <shipperAdress1>104 grande rue</shipperAdress1>
            <shipperAdress2></shipperAdress2>
            <shipperCity>Guérard</shipperCity>
            <shipperCivility>M</shipperCivility>
            <shipperContactName></shipperContactName>
            <shipperCountry>FR</shipperCountry>
            <shipperCountryName>FRANCE</shipperCountryName>
            <shipperEmail>carnicru@outlook.fr</shipperEmail>
            <shipperMobilePhone>0650506474</shipperMobilePhone>
            <shipperName>CARNICRU</shipperName>
            <shipperName2></shipperName2>
            <shipperPhone>0102030405</shipperPhone>
            <shipperPreAlert>0</shipperPreAlert>
            <shipperZipCode>77580</shipperZipCode>
            <shipperType>1</shipperType>
          </shipperValue>
          <customerValue>
            <customerAdress1></customerAdress1>
            <customerAdress2></customerAdress2>
            <customerCity></customerCity>
            <customerCivility>M</customerCivility>
            <customerContactName></customerContactName>
            <customerCountry>FR</customerCountry>
            <customerCountryName></customerCountryName>
            <customerEmail></customerEmail>
            <customerMobilePhone></customerMobilePhone>
            <customerName></customerName>
            <customerName2></customerName2>
            <customerPhone></customerPhone>
            <customerPreAlert></customerPreAlert>
            <customerZipCode></customerZipCode>
            <printAsSender></printAsSender>
          </customerValue>
          <recipientValue>
            <recipientName>${recipient.name}</recipientName>
            <recipientName2></recipientName2>
            <recipientAdress1>${recipient.address1}</recipientAdress1>
            <recipientAdress2></recipientAdress2>
            <recipientZipCode>${recipient.zipCode}</recipientZipCode>
            <recipientCity>${recipient.city}</recipientCity>
            <recipientCountry>${recipient.country}</recipientCountry>
            <recipientContactName></recipientContactName>
            <recipientEmail>${recipient.email}</recipientEmail>
            <recipientPhone>${recipient.phone}</recipientPhone>
            <recipientMobilePhone></recipientMobilePhone>
            <recipientPreAlert>0</recipientPreAlert>
            <recipientType>2</recipientType>
          </recipientValue>
          <refValue>
            <customerSkybillNumber></customerSkybillNumber>
            <recipientRef></recipientRef>
            <shipperRef></shipperRef>
            <idRelais></idRelais>
          </refValue>
          <skybillValue>
            <bulkNumber>1</bulkNumber>
            <codCurrency>EUR</codCurrency>
            <codValue>0</codValue>
            <content1></content1>
            <content2></content2>
            <content3></content3>
            <content4></content4>
            <content5></content5>
            <customsCurrency>EUR</customsCurrency>
            <customsValue></customsValue>
            <evtCode>DC</evtCode>
            <insuredCurrency>EUR</insuredCurrency>
            <insuredValue>0</insuredValue>
            <latitude></latitude>
            <longitude></longitude>
            <masterSkybillNumber/>
            <objectType>MAR</objectType>
            <portCurrency></portCurrency>
            <portValue>0</portValue>
            <productCode>${parcelDetails.productCode}</productCode>
            <qualite></qualite>
            <service>${parcelDetails.service}</service>
            <shipDate>${shipDate}</shipDate>
            <shipHour>${shipHour}</shipHour>
            <skybillRank></skybillRank>
            <source></source>
            <weight>${parcelDetails.weight}</weight>
            <weightUnit>KGM</weightUnit>
            <height>26</height>
            <length>26</length>
            <width>34</width>
            <as>${parcelDetails.as}</as>
            <subAccount></subAccount>
            <toTheOrderOf></toTheOrderOf>
            <skybillNumber></skybillNumber>
            <carrier></carrier>
            <skybillBackNumber></skybillBackNumber>
            <alternateProductCode></alternateProductCode>
            <labelNumber></labelNumber>
          </skybillValue>
          <skybillParamsValue>
            <duplicata>N</duplicata>
            <mode>PDF</mode>
            <withReservation>2</withReservation>
          </skybillParamsValue>
          <password>${PASSWORD}</password>
          <modeRetour>2</modeRetour>
          <numberOfParcel>1</numberOfParcel>
          <version>2.0</version>
          <multiParcel>N</multiParcel>
          <scheduledValue>
            <appointmentValue>
              <timeSlotEndDate>a remplir (jsp quoi mettre) : timeSlotEndDate</timeSlotEndDate>
              <timeSlotStartDate>jsp : timeSlotStartDate</timeSlotStartDate>
              <timeSlotTariffLevel>N1</timeSlotTariffLevel>
            </appointmentValue>
            <expirationDate>${expirationDate}</expirationDate>
            <sellByDate>jsp : sellByDate</sellByDate>
          </scheduledValue>
        </cxf:shippingMultiParcelV4>
      </soapenv:Body>
    </soapenv:Envelope>
  `;

  try {
    {/* cette url est a changer quand je passerai en mode de production */}
    const response = await fetch('https://ws.chronopost.fr/shipping-cxf/ShippingServiceWS', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'shippingMultiParcelV4', // Ajout de SOAPAction
      },      
      body: soapRequest,
    });

    const xmlResponse = await response.text();
    // Vous pouvez utiliser une bibliothèque comme `xml2js` pour parser la réponse XML

    return NextResponse.json({ success: true, label: xmlResponse });
  } catch (error) {
    console.error('Error with Chronopost API:', error);
    return NextResponse.json({ success: false, message: 'Erreur lors de la création de l\'étiquette' });
  }
}
