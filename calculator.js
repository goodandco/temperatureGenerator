class TemperatureCalculator {

   constructor (schemes) {
       this.schemes = schemes;
   }

   setTemperature (temperature) {
       this.temperature = temperature;
   }

   calculate () {
      let result = null,
          scheme  = this.getScheme();
      if (scheme) {
          result = scheme.calculate(this.temperature);
      }
        
      return result;
   }

   getScheme() {
	   let result = null;
	   
	   for (let scheme of this.schemes) {
		   if (scheme.check(this.temperature)) {
			   result = scheme;
		   }
	   }
       return result;
   }
}

class TemperatureScheme {
     
    get type () {
       return 'temperature_scheme';
    }

    get formulas () {
         return [];
    }
	
	check (temperature) {
		return temperature.replace(/[0-9]/g, '') == this.type;
	}

    calculate (temperature) {
        return this.formulas.reduce((result, formula) => {
			return Object.assign(result, formula.calculate(temperature));
		}, {});
    }

}

class TemperatureFormula {  
   constructor (calculator) {
       this.calculator = calculator;
   }
   
   calculate(temperature) {
       return this.calculator(temperature.replace(/[a-zA-z]/g, ''));
   }   
}

class CelsiyScheme extends TemperatureScheme {
	get type () {
		return 'C';
	}	
	
	get formulas () {
		return [
			new TemperatureFormula(celsiy => {
				return {[this.type]: celsiy + "C"};
			}),
			new TemperatureFormula(celsiy => {
				return {["F"]: (9/5 * celsiy + 32 )+ "F"};
			}),
			new TemperatureFormula(celsiy => {
				return {["K"]: (celsiy + 273 )+ "K"};
			})
		];
	}
}

class FarenheitScheme extends TemperatureScheme {
	get type () {
		return 'F';
	}	
	
	get formulas () {
		return [
			new TemperatureFormula(far => {
				return {[this.type]: far + "F"};
			}),
		   new TemperatureFormula(far => {
			   return {["C"] : (5/9 * (far - 32)) + "C"};
		   }),
		   new TemperatureFormula(far => {
			   return {["K"] : (5/9 * (far - 32) + 273) + "K"};
		   })
		];
	}
}

class KelvinScheme extends TemperatureScheme {
	get type () {
		return 'K';
	}	
	
	get formulas () {
		return [
			new TemperatureFormula(kelvin => {
				return {[this.type]: kelvin + "K"};
			}),
			new TemperatureFormula(kelvin => {
				return {["C"]: (kelvin - 273)+ "C"};
			}),
			new TemperatureFormula(kelvin => {
				return {["F"]: ((kelvin - 273) * 9/5 + 32) + "F"};
			})
		];
	}
}



let schemes = [new CelsiyScheme(), new FarenheitScheme(), new KelvinScheme()],
    application = new TemperatureCalculator(schemes);
	
application.setTemperature(process.argv[2]);
console.log(application.calculate());