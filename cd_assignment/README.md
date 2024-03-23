# Continuous Deployment auto-grader

For the [Continuous Deployment](https://courseworks2.columbia.edu/courses/198128/assignments/1179691) Assignment, we can check which things have been deployed by which student using a script. From this directory:

1. Follow the [course setup](#course-setup) instructions around `gcloud` and the CSV of students.
1. [Install Node.js](https://nodejs.org/en/download/current).
1. Install dependencies.

   ```bash
   npm install
   ```

1. Run the script.

   ```bash
   node cd_hw_check.js
   ```

You can check a particular student with

```sh
node check.js <uni>
```
