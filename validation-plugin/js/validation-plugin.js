// Created by AlexVanHell

(function ($) {
	$.fn.formValidation = function( options ) {

		var defaults = $.extend({}, options);

		if ( options.alerts !== undefined ){
			Object.keys(options.alerts).forEach( function( key, index ) {
				validationPluginDefaults.alerts[key] = options.alerts[key];
			});
		}
		if ( options.style !== undefined ) {
			Object.keys(options.style).forEach( function( key, index ) {
				validationPluginDefaults.style[key] = options.style[key];
			});
		}
		if ( options.mainAlert !== undefined ) {
			validationPluginDefaults.mainAlert = options.mainAlert;
		}
		if ( options.onSubmitFail !== undefined ) { 
			validationPluginDefaults.onSubmitFail = options.onSubmitFail;
		}
		if ( options.onSubmitSuccess !== undefined ) { 
			validationPluginDefaults.onSubmitSuccess = options.onSubmitSuccess;
		}
		defaults = validationPluginDefaults;

		// This function returns true if the input is completely validated (validate if is required and validation type)
		function validateField( input ) {
			var fieldValidated = true;
			var inputValue = input.val();
	        var isRequired = input.attr('required-field');
	        var hasValidationType = input.attr('validation-type');
	        var inputType = input.attr('type');

	        if ( isNotEmpty( input.val() ) ) {
	        	if ( typeof hasValidationType !== typeof undefined ) {
	        		if ( !getValidation( input, true ) ) {
						fieldValidated = false;
					} 
	        	}
	        } else {
	        	if ( typeof isRequired !== typeof undefined ) {
	        		if ( inputType === 'checkbox' ) {
	        			if ( !input.prop('checked') ) {
	        				fieldValidated = false;
	        			} 
	        		} else {
	        			fieldValidated = false;
	        		}
	        	}
	        }
			return fieldValidated;
		}

		// Return the respective (validation/alert message) for the especified input
		function getValidation( input, status ) {
			var inputValue = input.val();
			var validationType = input.attr('validation-type');
			var format = '';
			if ( validationType.indexOf('dateformat(') > -1 ) {
				format = validationType.substring( validationType.indexOf('('), validationType.length );
				validationType = 'dateformat';
			}

			var i = 0;

			// Every function returns a boolean
			var validationDataArray = [
				{ 
					name: 'letters',
					functionName: validateLetters( inputValue ),
					defaultMessage: defaults.alerts.letters
				}, {
					name: 'numbers',
					functionName: validateNumbers( inputValue ),
					defaultMessage: defaults.alerts.numbers
				}, {
					name: 'email',
					functionName: validateEmail( inputValue ),
					defaultMessage: defaults.alerts.email
				}, {
					name: 'price',
					functionName: validatePrice( inputValue ),
					defaultMessage: defaults.alerts.price
				}, {
					name: 'letters-numbers',
					functionName: validateLettersNumbers( inputValue ),
					defaultMessage: defaults.alerts.lettersNumbers
				}, {
					name: 'select',
					functionName: validateSelect( inputValue ),
					defaultMessage: defaults.alerts.select
				}, {
					name: 'dateformat',
					functionName: validateDateFormat( inputValue, format ),
					defaultMessage: defaults.alerts.dateformat
				}, {
					name: 'html',
					functionName: validateHtml(inputValue),
					defaultMessage: defaults.alerts.html
				}
			];

			for ( i = 0 ; i < validationDataArray.length ; i++ ) {
				if ( validationType === validationDataArray[i].name ) {
					break;
				}
			}

			if ( status ) {
				return validationDataArray[i].functionName;
			} else {
				return validationDataArray[i].defaultMessage;
			}
		}

		// showAlertMessage() shows or hides the alert message
		/* This function gets an element offset to set an alert message just below 
		input position relative to input parent */
		function showAlertMessage( status, input, message ) {
			input.removeAttr('style');
			input.parent().find('.fvp_validation_alert').remove();

			if ( status ) {
				var inputOffset = input.position();
				var inputHeight = input.outerHeight();
				var style = '';
				for( var property in defaults.style ) {
					style += property + ':' + defaults.style[property] + ';';
				}

				alertHtml =	'<div class="fvp_validation_alert" style="' + style + '">'
						  + 	'<span style="color: #fff;font-size: 14px;">' + message + '</span>'
						  +	'</div>';

				input.parent().append(alertHtml);
				input.css('outline', '1px solid ' + defaults.style.background );
			}
		}

		// tags to do validation
		var tags = 'input[validation-type],'
				+ ' textarea[validation-type],'
				+ ' input[required-field],'
				+ ' textarea[required-field],'
				+ ' select[required-field],'
				+ ' input[data-length],'
				+ ' textarea[data-length]';

		// tags to do match validation
		var matchTags = 'input[match-field],'
					 + ' textarea[match-field]';

        return this.each( function() {
        	var _this = $(this);
        	// Create an object, modify its attributes on tags events and check those at form.submit()
        	var validationObject = {};

        	validationObject.fields = []; // Each input will be pushed within this array
        	validationObject.match = true;
        	validationObject.submitValidation = true;

        	_this.find(tags).each( function( index ) {
        		var input = $(this);
        		input.parent().css('position', 'relative');

        		var isRequired = input.attr('required-field');
        		var hasValidationType = input.attr('validation-type');
        		var hasMatch = input.attr('match-field');
        		var hasLenght = input.attr('data-length');
        		var hasAlert = input.attr('alert-message');

        		var fieldObject = {};
        		fieldObject.isValid = true;

        		// Check if input is obligatory
        		if ( typeof isRequired !== typeof undefined ) {
        			fieldObject.isValid = false;
        		}

        		// Check if input has min or max length
        		if ( typeof hasLenght !== typeof undefined ) {
        			fieldObject.lengthText = 'Este campo debe tener';

        			if ( hasLenght.indexOf('-') > -1 ) { // input has length range
        				fieldObject.lengthText += ' entre ' 
        					+ hasLenght.split('-')[0] + ' y ' + hasLenght.split('-')[1];
        			} else { // input has no length range
        				if ( hasLenght.split(' ')[0] == 'min' ) {
        					fieldObject.lengthText += ' al menos '
        				} else {
        					fieldObject.lengthText += ' como maximo '
        				}
        				fieldObject.lengthText += hasLenght.split(' ')[1];
        			}
        			fieldObject.lengthText += ' caracter(es)';
        			
        		}

        		if ( typeof hasAlert !== typeof undefined ) {
        			fieldObject.alertText = hasAlert;
        		} else {
        			if ( input.is('select') ) {
	        			fieldObject.alertText = defaults.alerts.select;
	        		} else {
	        			if ( typeof hasValidationType != typeof undefined ) {
	        				fieldObject.alertText = getValidation( input, false );
	        			}
	        		}
        		}	

        		validationObject.fields.push( fieldObject );

        		input.bind('blur change keyup', function( event ) {
        			// Validate field on event
        			initValidation( input, index, event.type );
        		});
        	});

        	// $(plugin-selector).submit();
        	_this.submit( function( event ) {
        		var flagSubmit = true;
        		_this.find(tags).each( function( index ) {
        			var input = $(this);
        			initValidation( input, index );
        		});
        		// Iterate through validationObject.fields
        		for ( var i = 0 ; i < validationObject.fields.length ; i++ ) {
        			if ( validationObject.fields[i].isValid === false ) {
        				flagSubmit = false;
        				break;
        			}
        		}

        		// Check if match and flagSubmit are true
        		if ( validationObject.match && flagSubmit ) {
        			validationObject.submitValidation = true;
        		} else {
        			validationObject.submitValidation = false;
        		}

        		if ( !validationObject.submitValidation ) {
        			defaults.onSubmitFail();
        			// Send alert if main alert is enabled
        			if ( defaults.mainAlert === true ) {
        				alert( defaults.alerts.main );
        			}
	        		return false;
        		} else {
        			defaults.onSubmitSuccess();
        			return true;
        		}
        	});

        	function initValidation( input, index, event ) {
        		var isRequired = input.attr('required-field');
        		var hasLenght = input.attr('data-length');
        		var hasMatch = input.attr('match-field');
        		var inputType = input.attr('type');

        		if ( typeof event === typeof undefined ) { event = ''; }
        		showAlertMessage( false, input );

        		if ( validateField( input ) ) {
    				validationObject.fields[index].isValid = true;
    				showAlertMessage( false, input );
    				if ( typeof hasLenght !== typeof undefined ) {
    					if ( !validateLength( input ) && isNotEmpty( input.val() ) ) {
    						validationObject.fields[index].isValid = false;
    						if ( event !== 'keyup' ) {
    							showAlertMessage( true, input, validationObject.fields[index].lengthText );    							
    						}
    					}
    				}
    				if ( typeof hasMatch !== typeof undefined ) {
        				if ( !validateMatch( $(matchTags).eq(0).val() , $(matchTags).eq(1).val() ) ) {
        					validationObject.match = false;
        					if ( event !== 'keyup' ) {
        						showAlertMessage( true, $(matchTags).eq(1), defaults.alerts.match );
        					}
        				} else {
        					validationObject.match = true;
        					showAlertMessage( false, $(matchTags).eq(1) );
        				}
        			}
    			} else {
    				validationObject.fields[index].isValid = false;
    				if ( event !== 'keyup' ) {
    					if ( isNotEmpty( input.val() ) ) {
    						showAlertMessage( true, input, validationObject.fields[index].alertText );
    					} else {
    						if ( typeof isRequired !== typeof undefined ) {
    							if ( input.is('select') ) {
    								showAlertMessage( true, input, validationObject.fields[index].alertText );
    							} else {
    								if ( inputType === 'checkbox' ) {
				        				showAlertMessage( true, input, defaults.alerts.checkbox );
				        			} else {
				        				showAlertMessage( true, input, defaults.alerts.null );
				        			}
    							}
	    					}
    					}
    				}
    			}
        	}
        });
	};

	// return true if variable is != null or != ''
	function isNotEmpty( variable ) {
		return variable !== null && variable.trim() !== '';
	}

	// This functions gets a $(selector)
	/* lengthFormat: { // number has to be an Interger
			min: data-length="min number", 
			max: data-length="min number",
			range: data-lenght="number1-number2"
		}
	*/
	function validateLength( input ) { // input = $(selector)
		var lengthAttr = input.attr('data-length');
		var variable = input.val();
		var hasRange = false;

		if ( lengthAttr.indexOf('-') > -1 ) { // input has length range
			hasRange = true;
		}
		
		if ( hasRange ) { // input has length range
			var minLength = parseInt( lengthAttr.split('-')[0] );
			var maxLength = parseInt( lengthAttr.split('-')[1] );

			return variable.length >= minLength && variable.length <= maxLength;
		} else {
			var lengthNumber = 0;

			if ( lengthAttr.split(' ')[0] == 'min' ) {
				lengthNumber = parseInt(lengthAttr.split(' ')[1]);

				return variable.length >= lengthNumber;
			} else if ( lengthAttr.split(' ')[0] == 'max' ) {
				lengthNumber = parseInt(lengthAttr.split(' ')[1]);

				return variable.length <= lengthNumber;
			}
		}
	}

	// I think you must know what these functions below do. Them names already say it ;)
	function validateNumbers( variable ) {
    	var patron = /^[0-9]*$/;
		return !variable.search(patron);
    }

	function validateLetters( variable ) {
		var patron = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ\s]*$/;
		return !variable.search(patron);
	}

	function validateLettersNumbers( variable ) {
		var patron = /^[a-zA-ZñÑáéíóúÁÉÍÓÚ0-9\s]*$/;
		return !variable.search(patron);
	}

	function validateEmail( variable ) {
		var patron = /^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z\s]{2,4})$/;
		return !variable.search(patron);
	}

	function validatePrice( variable ) {
		var patron = /(?:\d*\.)?\d+/;
		return !variable.search(patron);
	}

	function validateMatch( variable, variable2 ) {
		return variable === variable2 || ( variable === '' && variable2 === '' );
	}

	function validateSelect( variable ) {
		return variable !== null && variable.trim() !== '';
	}

	// Default date format is (dd/mm/yyyy)
	function validateDateFormat( variable, format ) {
		var regExp = '';
		var day = 0, month = 0, year = 0;
		var dateSplit = [];
		if ( format === undefined || format === '' ){
			format = '(dd/mm/yyyy)';
		}

		if ( format.indexOf('/') > -1 ) {
			if ( !/^\d{2}\/\d{2}\/\d{4}$/.test(variable) ){
        		return false;
			} else {
				dateSplit = variable.split('/');
			}
		} else {
			if ( !/^\d{2}\-\d{2}\-\d{4}$/.test(variable) ){
        		return false;
			} else {
				dateSplit = variable.split('-');
			}
		}

		year = dateSplit[2];
		// format = (dd/mm/yyyy) or (mm-dd-yyyy)
		if ( format[1] === 'd' ){
			day = dateSplit[0];
			month = dateSplit[1];
		} else if ( format[1] === 'm' ) {
			day = dateSplit[1];
			month = dateSplit[0];
		}

		// Check the ranges of month and year
	    if ( year < 1000 || year > 3000 || month == 0 || month > 12 ) {
	        return false;
	    }

	    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

	    // Adjust for leap years
	    if( year % 400 == 0 || (year % 100 != 0 && year % 4 == 0) ){
	        monthLength[1] = 29;
	    }

	    // Check the range of the day
	    return day > 0 && day <= monthLength[month - 1];
	}

	function validateHtml( variable ) {
		var flag = true;

		for (var i = 0; i < variable.length; i++) {
			if ( variable[i] === '<' || variable[i] === '>' ) {
				flag = false;
				break;
			}
		}
		return flag;
	}

	// this is default
	var validationPluginDefaults = {
		mainAlert: false,
		alerts: {
			main: '¡Por favor verifica bien todos los campos antes de enviar!',
			null: 'Completa este campo',
			letters: 'Solo se permiten letras en este campo.',
			lettersNumbers: 'Solo se permiten numeros y letras en este campo',
			numbers: 'Solo se permiten numeros en este campo.',
			email: 'Email invalido, verifica que no haya mayusculas ni espacios entre el correo.',
			price: 'Intoruce un formato valido de precio.',
			match: 'Las contraseñas no coinciden.',
			select: 'Elige una opción',
			checkbox: 'Marca este campo para continuar',
			dateformat: 'Formato de fecha debe ser (dd/mm/aaaa) y ser una fecha valida.',
			html: 'Hay un caracter invalido.'
		}, style: {
			'position': 'relative',
			'z-index': 0,
			'padding': '4px',
			'background': 'red'
		}, 
		onSubmitFail: function() {},
		onSubmitSuccess: function() {}
	}

}(jQuery));