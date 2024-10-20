# DomainQA

**How to start working in this project?**

1. Clone repository to your machine.

2. Navigate to project root folder.

3. Run command ```npm ci``` in terminal VScode.

4. Run command ```npx playwright install``` in terminal VScode.

5. Copy and paste the file .env.example to project root folder. Сhange the file name to .env. Put your own credentials for login in this file.

6. Before committing and pushing code to the repository, please run the following command to ensure proper code formatting:
```npm run format```. This step is necessary to maintain consistent code style across the project.

7. To create and open allure-report execute in terminal the following command ```npm run report-open```.

**Attention!**

QA Engineers are not allowed to install any libraries, plugins, etc. to avoid changing configuration files.