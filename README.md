# Validation Plugin
Plug-in de validación de campos para uso en html con jQuery

## Instalacion

1. Añadir jQuery
```html
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
```

2. Llamar el archivo js para el plug-in justo despues de haber agregado jQuery
```html
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
<script type="text/javascript" src="js/validation-plugin.js"></script>
```

<br>

## Implementación y Uso

Usar siempre un formulario para hacer la validación
```js
$('form').formValidation({});
```

### Editar valores por defecto

Puedes editar los valores predeterminados para mensajes y estilos de alerta
```js
$('form').formValidation({
    mainAlert: true,
    alerts: {
    	main: '¡Por favor verifica bien todos los campos antes de enviar!',
        null: 'Completa este campo',
        letters: 'Solo se permiten letras en este campo.',
        lettersNumbers: 'Solo se permiten numeros y letras en este campo',
        numbers: 'Solo se permiten numeros en este campo.',
        email: 'Correo electrónico invalido. El correo debe ser de tipo correo@correo.com',
        price: 'Intoruce un formato valido de precio.',
        match: 'Las contraseñas no coinciden.',
        select: 'Elige una opción.',
        checkbox: 'Marca este campo para continuar',
        dateformat: 'Formato de fecha debe ser (dd/mm/aaaa) y ser una fecha valida.'
    },
    style: {
        position: 'relative',
        z-index: 0,
        padding: '4px',
        background: 'red'
    }
});
```

### Funciones en caso de exito y error
```js
$('form').formValidation({
    onSubmitFail: function() {
        // implementar codigo en caso de tener algun campo incorrecto
    },
    onSubmitSuccess: function() {
        // implementar codigo al tener exito en todos los campos
    }
});
```

### HTML

Asegurate de colocar los `<input>` dentro de alguna otra etiqueta

**NOTE:** Todos los atributis

#### Campo Obligatorio
```html
<form>
    <div>
        <input type="text" required-field />
    </div>
    <div>
        <input type="checkbox" required-field />
    </div>
    <div>
        <select required-field />
    </div>
    <div>
        <textarea required-field />
    </div>
</form>
```

#### Tipo de Validación
```html
<form>
    <div>
        <input type="text" validation-type="letters" />
    </div>
</form>
```

##### Tipo de validación disponible
1. `letters` Validar que solo contenga letras y espacios
2. `numbers` Validar que solo contenga numeros
3. `letters-numbers` Validar que solo contenga letras, numeros y espacios
4. `email` Validar que el campo tenga un formato de correo electrónico valido
5. `select` Validar que un campo de tipo `<select>` tenga algun valor seleccionado 
6. `dateformat` Validar formato de fecha valido
7. `price` Validar que contenga un precio valido
8. `html`Validar que no contenga caracteres especiales html


##### Formato de fecha (dateformat)
Por defecto el plugin acepta un formato de fecha dd/mm/yyyy
Para cambiarlo solo hay que hacer lo siguiente
El plugin solo acepta formatos con `/` y `-`
```html
    <!-- fomato dd-mm-yyyy -->
    <input type="text" validation-type="dateformat(dd-mm-yyyy)" />
    
    <!-- fomato mm/dd/yyyy -->
    <input type="text" validation-type="dateformat(mm/dd/yyyy)" />
```

#### Min y Max Length
Este es para indicar el numero de caracteres que debe tener el campo como minimo o como maximo. O se puede especificar un rango
```html
    <!-- Minimo -->
    <input type="text" data-length="min 8" />
    
    <!-- Maximo -->
    <input type="text" data-length="max 140" />
    
    <!-- Rango -->
    <input type="text" data-length="20-30" />
```

#### Alertas Individuales

Puedes agregar una alerta personalizada de la siguiente manera
```html
    <input type="text" alert-message="Esto es una alerta personalizada" />
```
