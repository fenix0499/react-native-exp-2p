import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Image,
  Button,
  TouchableOpacity,
} from "react-native";
import firebase from "../utils/firebase";

export default function Cotizador({ user: { email } }) {
  const [validation, setValidation] = useState(false);
  const [calculoFinal, setCalculoFinal] = useState({
    cantidadSolicitada: 0,
    interesFinal: 0,
    ivaFinal: 0,
    pagoMensualFinal: 0,
  });

  return <>{validation ? <Resumen email={email} calculoFinal={calculoFinal} /> : <Calculo validation={validation} setValidation={setValidation} calculoFinal={calculoFinal} setCalculoFinal={setCalculoFinal} />}</>;
}

function Calculo({ validation, setValidation, calculoFinal, setCalculoFinal }) {
  

  const [sueldo, setSueldo] = useState({
    sueldo: 0,
    prestamo: 0,
  });

  const [mensualidades, setMensualidades] = useState({
    tresMeses: true,
    seisMeses: true,
    nueveMeses: true,
    doceMeses: true,
    veinteCuatroMeses: true,
  });

  const [mensualidadSelected, setMensualidadSelected] = useState(3);

  useEffect(() => {
    if (sueldo.sueldo >= 1 && sueldo.sueldo <= 10000) {
      setMensualidades({
        ...mensualidades,
        tresMeses: false,
        seisMeses: false,
      });
      console.log(mensualidades);
      console.log(sueldo.sueldo);
    } else if (sueldo.sueldo > 10000 && sueldo.sueldo <= 20000) {
      setMensualidades({
        ...mensualidades,
        tresMeses: false,
        seisMeses: false,
        nueveMeses: false,
      });
      console.log("Segunda condicional!!!");
      console.log(mensualidades);
    } else if (sueldo.sueldo > 20000) {
      setMensualidades({
        ...mensualidades,
        tresMeses: false,
        seisMeses: false,
        nueveMeses: false,
        doceMeses: false,
        veinteCuatroMeses: false,
      });
      console.log("Tercera condicional!!!");
      console.log(mensualidades);
    }
  }, [sueldo.sueldo]);

  useEffect(() => {
    console.log(mensualidadSelected);
  }, [mensualidadSelected]);

  useEffect(() => {
    console.log(sueldo.prestamo);
  }, [sueldo.prestamo]);

  const logout = () => {
    firebase.auth().signOut();
  };

  const calculoPrestamo = () => {
    let userSueldo = sueldo.sueldo;
    let userPrestamo = sueldo.prestamo;
    let userMeses = mensualidadSelected;
    let iva = 0.16;
    let impuesto = 0;

    if (userSueldo > 1 && userSueldo <= 10000) {
      impuesto = 0.02;
    } else if (userSueldo > 10000 && userSueldo <= 20000) {
      impuesto = 0.04;
    } else if (userSueldo > 20000) {
      impuesto = 0.06;
    }

    
    let soloInteres = userPrestamo * impuesto;
    

    let interesTotal = (impuesto * userPrestamo) + userPrestamo;
    let ivaTotal = (iva * interesTotal) + interesTotal;
    let soloIva = iva * interesTotal;

    let pagoMensual = ivaTotal / userMeses;
    console.log(`Este es el pago mensual: ${pagoMensual.toFixed(2)}`)

    setCalculoFinal({
      ...calculoFinal,
      cantidadSolicitada: userPrestamo,
      interesFinal: soloInteres,
      ivaFinal: soloIva,
      pagoMensualFinal: pagoMensual,
    });

    console.log(calculoFinal);
  };

  return (
    <View style={[styles.container]}>
      <TextInput
        style={[styles.input]}
        placeholder="Sueldo"
        placeholderTextColor="#969696"
        keyboardType="numeric"
        onChange={(e) =>
          setSueldo({ ...sueldo, sueldo: parseFloat(e.nativeEvent.text) })
        }
      />

      <TextInput
        style={[styles.input]}
        placeholder="Prestamo"
        placeholderTextColor="#969696"
        keyboardType="numeric"
        onChange={(e) =>
          setSueldo({ ...sueldo, prestamo: parseFloat(e.nativeEvent.text) })
        }
      />

      <View style={[styles.containerButtons]}>
        <TouchableOpacity
          disabled={mensualidades.tresMeses}
          style={[styles.buttons]}
          onPress={() => {
            setMensualidadSelected(3);
            calculoPrestamo();
          }}
        >
          3
        </TouchableOpacity>
        <TouchableOpacity
          disabled={mensualidades.seisMeses}
          style={[styles.buttons]}
          onPress={() => {
            setMensualidadSelected(6);
            calculoPrestamo();
          }}
        >
          6
        </TouchableOpacity>
        <TouchableOpacity
          disabled={mensualidades.nueveMeses}
          style={[styles.buttons]}
          onPress={() => {
            setMensualidadSelected(9);
            calculoPrestamo();
          }}
        >
          9
        </TouchableOpacity>
        <TouchableOpacity
          disabled={mensualidades.doceMeses}
          style={[styles.buttons]}
          onPress={() => {
            setMensualidadSelected(12);
            calculoPrestamo();
          }}
        >
          12
        </TouchableOpacity>
        <TouchableOpacity
          disabled={mensualidades.veinteCuatroMeses}
          style={[styles.buttons]}
          onPress={() => {
            setMensualidadSelected(24);
            calculoPrestamo();
          }}
        >
          24
        </TouchableOpacity>
      </View>

      <Text style={[styles.input]}>{calculoFinal.pagoMensualFinal === 0 ? 'Pago Mensual' : `${calculoFinal.pagoMensualFinal}`}</Text>
      <Button title="Resumen" onPress={() => setValidation(!validation) }></Button>
      <Button title="cerrar sesión" onPress={logout}></Button>
    </View>
  );
}

function Resumen({ email, calculoFinal: { cantidadSolicitada, interesFinal, ivaFinal, pagoMensualFinal} }) {

  const logout = () => {
    firebase.auth().signOut();
  };

  return (
    <View>
      <Text style={[styles.input]}>{email}</Text>
      <Text style={[styles.input]}>{`El prestamo solicitado es: ${cantidadSolicitada}`}</Text>
      <Text style={[styles.input]}>{`El interes es: ${interesFinal}`}</Text>
      <Text style={[styles.input]}>{`El iva es: ${ivaFinal}`}</Text>
      <Text style={[styles.input]}>{`El pago mensual es de: $${pagoMensualFinal.toFixed(4)}`}</Text>
      <Button title="cerrar sesión" onPress={logout}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  btnT: {
    color: "#fff",
    fontSize: 18,
  },
  input: {
    height: 35,
    color: "#fff",
    marginBottom: 25,
    width: "100%",
    backgroundColor: "#1e3040",
    paddingHorizontal: 20,
    borderRadius: 50,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#1e3040",
    marginLeft: 0,
    marginRight: 0,
    textAlign: "center",
  },
  login: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  errorInput: {
    borderColor: "#940c0c",
  },
  container: {
    width: "90%",
    height: 500,
    flex: 1,
    alignContent: "center",
    flexDirection: "column",
    backgroundColor: "#000",
    marginLeft: "5%",
    marginRight: "5%",
    paddingTop: "10%",
  },
  containerButtons: {
    width: "100%",
    height: "auto",
    backgroundColor: "#fff",
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: 50,
  },
  buttons: {
    backgroundColor: "#838383",
    width: 60,
    height: 60,
    borderRadius: 100,
    fontSize: 40,
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  mesesActive: {
    display: "flex",
  },
  mesesInactive: {
    display: "none",
  },
});
