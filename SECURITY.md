## Coding Practices

In this section we highlight patterns where particular care needs to be taken in order to avoid security vulnerabilities, as well as the best practices to follow.

### Local file path resolution

A common pitfall in backend packages is to resolve local file paths based on user input, without sufficiently protecting against input that traverses outside the intended directory.

For example, consider the following code:

```ts
// WARNING: DO NOT DO THIS

import { join } from 'path';
import fs from 'fs-extra';

function writeTemporaryFile(tmpDir: string, name: string, content: string) {
  const filePath = join(tmpDir, name);
  await fs.writeFile(filePath, content);
}
```

If the `name` of the file is controlled by the user, they can for example enter `../../../../etc/hosts` as the name of the file. This can lead to a file being written outside the intended directory, which in turn can be used to inject malicious code or other form of attacks.

The recommended solution to this is to use `resolveSafeChildPath` from `@backstage/backend-common` to resolve the file path instead. It makes sure that the resolved path does not fall outside the provided directory. If you simply want to validate whether a file path is safe, you can use `isChildPath` instead.

The insecure example above should instead be written like this:

```ts
// THIS IS GOOD, DO THIS

import { resolveSafeChildPath } from '@backstaghe/backend-common';
import fs from 'fs-extra';

function writeTemporaryFile(tmpDir: string, name: string, content: string) {
  const filePath = resolveSafeChildPath(tmpDir, name);
  await fs.writeFile(filePath, content);
}
```

### Express responses

When returning a response from an Express route, always use `.json(...)` or `.end()` without any arguments. This ensures that the response can not be interpreted as an HTML document with embedded JavaScript by the browser. Never use `.send(...)` unless you want to send other forms of content, and be sure to always set an explicit content type. If you need to return HTML or other content that may be executed by the browser, be very careful how you handle user input.

If you want to return an error response, simply throw the error or pass it on to the `next(...)` callback. There is a middleware installed that will transform the error into a JSON response. Many of the common HTTP errors are available from `@backstage/errors`, for example `NotFoundError`, which will also set the correct status code.

The following example show how to return an error that contains user input:

```ts
res.send(`Invalid id: '${req.params.id}'`); // BAD

// import { InputError } from '@backstage/errors';
throw new InputError(`Invalid id: '${req.params.id}'`); // GOOD

// OR, in case a custom response is needed
res.json({ message: `Invalid id: '${req.params.id}'` }); // NOT BAD
```

No matter how trivial it may seem, always use `.json(...)`. It reduces the risk that a future refactoring introduces vulnerabilities:

```ts
res.send({ ok: true }); // BAD

res.json({ ok: true }); // GOOD
```

If you absolutely must return a string with `.send(...)`, use an explicit and secure `Content-Type`:

```ts
res.send(`message=${message}`); // BAD

res.contentType('text/plain').send(`message=${message}`); // GOOD
```

An example of how to return dynamic HTML is not provided here. If you need to do so, proceed with extreme caution and be very sure that you know what you are doing.