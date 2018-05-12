IDEA
====

Expect and mock network requests at runtime.

# Desired API
```javascript
qars.get("www.website.com/login", mock, {schema: schema})
```

# What needs to happen
## In mock mode
- Since we only have one server, it can only serve one response at a time. => We need a queue. (That way, the app will also verify if the request even had been made or not.)
- As soon as `qars.get()` is being called, the global variable `mock` is changed to match the object which we receive with this function.
- After the response has been sent, `mock` is being cleared and the queue is being resolved.

# In real-life mode
- The app compares the real-life response with the actual response received
- If a schema is given, the app will schema validate that reponse
