# JS Validation Plugin
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

Mandar a llamar `$('form').formValidation({});` y agregarlo dentro del `$(document).ready` o al final de la pagina.
```html
<script type="text/javascript">
    $(document).ready( function() {
        $('form').formValidation({});
    });
</script>
```

### JS

#### Modificar valores predeterminados
Puedes editar los valores predeterminados para mensajes y estilos de alerta.
<br> Puedes agregar mas atributos en `style`. Para que no haya alguna falla agregar estos atributos entre comillas simples `'`
```js
// Estos son los valores por defecto
$('form').formValidation({
    mainAlert: false, // true para activar un alert() al hacer submit y en caso de haber algun error
    alerts: {
        main: '¡Por favor verifica bien todos los campos antes de enviar!', // Este es el que se muestra en caso de tener mainAlert: true
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
});
```

#### Funciones en caso de exito y error
Estas funciones se ejecutan al hacer submit a un formulario
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
Asegurate de colocar los `<input>` dentro de alguna otra etiqueta (div, section, span, etc).

**NOTA:** Todos los atributos se pueden usar de forma simultanea

#### Campo obligatorio
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

#### Tipo de validación
```html
<form>
    <div>
        <input type="text" validation-type="letters" />
    </div>
</form>
```

##### Tipos de validación disponible
validation-type
1. `letters` Validar que solo contenga letras y espacios
2. `numbers` Validar que solo contenga numeros
3. `letters-numbers` Validar que solo contenga letras, numeros y espacios
4. `email` Validar que el campo tenga un formato de correo electrónico valido
5. `select` Validar que un campo de tipo `<select>` tenga algun valor seleccionado 
6. `dateformat` Validar formato de fecha valido
7. `price` Validar que contenga un precio valido
8. `html`Validar que no contenga caracteres especiales html

<br>
required-field y match-field 
1. `required-field` Valida que el campo no este vacio
2. `match-field` Valida que los campos coincidad (todos los campos que tengan este aributo)


##### Formato de fecha (dateformat)
Por defecto el plugin acepta un formato de fecha (dd/mm/yyyy)
<br> El plugin solo acepta formatos con `/` y `-`.
<br> Para cambiarlo solo hay que hacer lo siguiente:

```html
<!-- fomato dd-mm-yyyy -->
<input type="text" validation-type="dateformat(dd-mm-yyyy)" />

<!-- fomato mm/dd/yyyy -->
<input type="text" validation-type="dateformat(mm/dd/yyyy)" />
```


#### Min y Max Length
Este es para indicar el numero de caracteres que debe tener el campo como minimo o como maximo. O se puede especificar un rango.
```html
<!-- Minimo -->
<input type="text" data-length="min 8" />

<!-- Maximo -->
<input type="text" data-length="max 140" />

<!-- Rango -->
<input type="text" data-length="20-30" />
```


#### Match
Este atributo se utiliza en caso de requerir que dos o mas campos coincidan.
```html
<!-- Campo 1 -->
<div>
    <input type="password" match-field />
</div>
<!-- Campo 2 -->
<div>
    <input type="password" match-field />
</div>
```


#### Alertas Individuales

Puedes agregar una alerta personalizada de la siguiente manera:
```html
<input type="text" alert-message="Esto es una alerta personalizada" />
```
