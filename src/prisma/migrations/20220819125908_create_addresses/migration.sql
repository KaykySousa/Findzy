-- CreateTable
CREATE TABLE `addresses` (
    `id` VARCHAR(191) NOT NULL,
    `logradouro` VARCHAR(191) NOT NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `localidade` VARCHAR(191) NOT NULL,
    `uf` VARCHAR(191) NOT NULL,
    `companyId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `addresses_companyId_key`(`companyId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
