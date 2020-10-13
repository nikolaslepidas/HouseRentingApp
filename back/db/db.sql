-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema airbnb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema airbnb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `airbnb` DEFAULT CHARACTER SET utf8 ;
USE `airbnb` ;

-- -----------------------------------------------------
-- Table `airbnb`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `airbnb`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `surname` VARCHAR(45) NULL,
  `email` VARCHAR(45) NULL,
  `phone` VARCHAR(45) NULL,
  `role` INT NULL,
  `username` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NULL,
  `admin` INT NULL,
  `profile_img` VARCHAR(45) NULL,
  `accepted` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `airbnb`.`apartment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `airbnb`.`apartment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NULL,
  `image` VARCHAR(45) NULL,
  `latitude` VARCHAR(45) NULL,
  `longitude` VARCHAR(45) NULL,
  `city` VARCHAR(45) NULL,
  `region` VARCHAR(45) NULL,
  `address` VARCHAR(45) NULL,
  `bedrooms` INT NULL,
  `beds` INT NULL,
  `bathrooms` INT NULL,
  `kitchens` INT NULL,
  `smoking` INT NULL,
  `pets` INT NULL,
  `tv` INT NULL,
  `wifi` INT NULL,
  `airCondition` INT NULL,
  `elevator` INT NULL,
  `parking` INT NULL,
  `start` DATE NULL,
  `end` DATE NULL,
  `minDays` INT NULL,
  `rating` FLOAT NULL,
  `reviews` INT NULL,
  `costPerNight` INT NULL,
  `type` VARCHAR(45) NULL,
  `guests` INT NULL,
  `description` VARCHAR(500) NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`, `user_id`),
  INDEX `fk_apartment_user1_idx` (`user_id` ASC),
  CONSTRAINT `fk_apartment_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `airbnb`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `airbnb`.`reservation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `airbnb`.`reservation` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `start` DATE NULL,
  `end` DATE NULL,
  `guests` INT NULL,
  `cost` INT NULL,
  `rating` FLOAT NULL,
  `review` VARCHAR(500) NULL,
  `user_id` INT NOT NULL,
  `apartment_id` INT NOT NULL,
  `apartment_user_id` INT NOT NULL,
  PRIMARY KEY (`id`, `user_id`, `apartment_id`, `apartment_user_id`),
  INDEX `fk_reservation_user1_idx` (`user_id` ASC),
  INDEX `fk_reservation_apartment1_idx` (`apartment_id` ASC, `apartment_user_id` ASC),
  CONSTRAINT `fk_reservation_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `airbnb`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_reservation_apartment1`
    FOREIGN KEY (`apartment_id` , `apartment_user_id`)
    REFERENCES `airbnb`.`apartment` (`id` , `user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `airbnb`.`message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `airbnb`.`message` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `body` VARCHAR(500) NULL,
  `receiver` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`, `user_id`, `receiver`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC),
  CONSTRAINT `fk_message_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `airbnb`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `airbnb`.`image`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `airbnb`.`image` (
  `filename` VARCHAR(45) NOT NULL,
  `apartment_id` INT NOT NULL,
  `apartment_user_id` INT NOT NULL,
  PRIMARY KEY (`apartment_id`, `filename`, `apartment_user_id`),
  CONSTRAINT `fk_image_apartment1`
    FOREIGN KEY (`apartment_id` , `apartment_user_id`)
    REFERENCES `airbnb`.`apartment` (`id` , `user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
