**Edit a file, create a new file, and clone from Bitbucket in under 2 minutes**

When you're done, you can delete the content in this README and update the file with details for others getting started with your repository.

_We recommend that you open this README in another tab as you perform the tasks below. You can [watch our video](https://youtu.be/0ocf7u76WSo) for a full demo of all the steps in this tutorial. Open the video in a new tab to avoid leaving Bitbucket._

---

## Edit a file

You’ll start by editing this README file to learn how to edit a file in Bitbucket.

1. Click **Source** on the left side.
2. Click the README.md link from the list of files.
3. Click the **Edit** button.
4. Delete the following text: _Delete this line to make a change to the README from Bitbucket._
5. After making your change, click **Commit** and then **Commit** again in the dialog. The commit page will open and you’ll see the change you just made.
6. Go back to the **Source** page.

---

## Create a file

Next, you’ll add a new file to this repository.

1. Click the **New file** button at the top of the **Source** page.
2. Give the file a filename of **contributors.txt**.
3. Enter your name in the empty file space.
4. Click **Commit** and then **Commit** again in the dialog.
5. Go back to the **Source** page.

Before you move on, go ahead and explore the repository. You've already seen the **Source** page, but check out the **Commits**, **Branches**, and **Settings** pages.

---

## Clone a repository

Use these steps to clone from SourceTree, our client for using the repository command-line free. Cloning allows you to work on your files locally. If you don't yet have SourceTree, [download and install first](https://www.sourcetreeapp.com/). If you prefer to clone from the command line, see [Clone a repository](https://confluence.atlassian.com/x/4whODQ).

1. You’ll see the clone button under the **Source** heading. Click that button.
2. Now click **Check out in SourceTree**. You may need to create a SourceTree account or log in.
3. When you see the **Clone New** dialog in SourceTree, update the destination path and name if you’d like to and then click **Clone**.
4. Open the directory you just created to see your repository’s files.

Now that you're more familiar with your Bitbucket repository, go ahead and add a new file locally. You can [push your change back to Bitbucket with SourceTree](https://confluence.atlassian.com/x/iqyBMg), or you can [add, commit,](https://confluence.atlassian.com/x/8QhODQ) and [push from the command line](https://confluence.atlassian.com/x/NQ0zDQ).

## TUTORES

> Un tutor se creara durante la carga del legajo y este podra ver la la informacion del alumno. Un tutor puede estar en mas de un legajo, pudiendo asi, se tutor de mas de un chico.
> El sistema brindara la posibilidad de crear 'Tutores Secundarios' para ver la informacion de los alumnos a seleccionar.

-   Importante! el 'Tutor Secundario' no reemplazara el 'Tutor Oficial', para hacer eso, debera actualizar los datos del tutor desde 'Actualizar Legajo'.

## Autoridades : Flujo creacion de tutores

### GET : '/api/autoridades/legajos'

-   PARAMS: documento (persona a dar de alta)
-   RESPONSE - OK:

        ´´´
        statusCode: 200,
        message: "OK",
        data: {
            id: string,
            nombre: string,
            apellido: string,
            numeroDocumento: string
            legajos: [
                {
                id: string,
                nombre: string,
                apellido: string,
                fechaNacimiento: string,
                numeroDocumento: number,
                tutor: boolean
                }
            ]
        }
        ´´´

-   RESPONSE - BAD:

        ´´´
            statusCode: 404,
            message: 'La persona no existe en nuestra base de datos.' / 'La persona ingresada no tiene hijos inscriptos en la escuela.'
        ´´´

### POST : '/api/autoridades/usuario/crear'

-   PARAMS: numeroDocumento: string, idAlumno: string
-   PAYLOAD:

        ´´´
            statusCode: 200,
            message: "Autoridad creada con éxito.",
            data: {
                tipo: string
                escuela: string / null
                persona: {
                    numeroDocumento: string,
                    nombre: string,
                    apellido: string
                }
                cursos: string[]
                alumnos: string[]
            }
        ´´´

## NODEMAILER - CONFIGURACION DE CORREO ELECTRONICO

        - Ir a la cuenta de GOOGLE
        - Gestionar tu cuenta de GOOGLE
        - Seguridad
        - Iniciar sesión con GOOGLE
        - Apartado de "Verificación de dos pasos"
        - Ingresamos numero de celular y validamos recepción de codigo
        - Luego se activara una nueva opcion en Seguridad - Iniciar sesión con GOOGLE definido como "Contraseñas de aplicaciones"
        - Seleccionamos una aplicación -> otra
        - Ponemos nombre "Siga-API" y copiamos la contraseña generada y pegamos en archivo .env - NODEMAILER_CLAVE

## PENDIENTES

    - Cursos: alta, editar, baja obtener por id y obtener todos ABM. // Un preceptor tiene un array de cursos
    - Endpoint para asociar un curso a un legajo
    - Crear autoridades, revisar por tipo de autoridad, tipo tutor y preceptor son autoridades diferentes - PENDIENTE PARA FINAL
