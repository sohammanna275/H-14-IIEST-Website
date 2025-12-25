-- MySQL dump 10.13  Distrib 9.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: iiesthosteldb
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `leaveregister`
--

DROP TABLE IF EXISTS `leaveregister`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leaveregister` (
  `leaveID` bigint NOT NULL AUTO_INCREMENT,
  `studentID` bigint NOT NULL,
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `reason` varchar(1000) DEFAULT NULL,
  `approvedBy` varchar(20) DEFAULT NULL,
  `approvedOn` datetime DEFAULT NULL,
  PRIMARY KEY (`leaveID`),
  KEY `studentID` (`studentID`),
  CONSTRAINT `leaveregister_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `tblstudent` (`studentID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaveregister`
--

LOCK TABLES `leaveregister` WRITE;
/*!40000 ALTER TABLE `leaveregister` DISABLE KEYS */;
INSERT INTO `leaveregister` VALUES (1,23,'2025-12-17 00:00:00','2025-12-19 00:00:00','i need sleep','admin','2025-12-25 14:33:26'),(2,23,'2025-12-09 00:00:00','2025-12-19 00:00:00','reason','admin','2025-12-25 14:33:51'),(3,23,'2025-12-25 00:00:00','2025-12-26 00:00:00','hello','admin','2025-12-25 14:41:11'),(4,23,'2025-12-18 00:00:00','2025-12-27 00:00:00','hfdhsjhjd','admin','2025-12-25 15:09:03'),(5,23,'2025-12-25 00:00:00','2025-12-27 00:00:00','gfggsdfe ','admin','2025-12-25 15:09:05');
/*!40000 ALTER TABLE `leaveregister` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbldept`
--

DROP TABLE IF EXISTS `tbldept`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbldept` (
  `deptNo` int NOT NULL AUTO_INCREMENT,
  `deptName` varchar(100) NOT NULL,
  PRIMARY KEY (`deptNo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbldept`
--

LOCK TABLES `tbldept` WRITE;
/*!40000 ALTER TABLE `tbldept` DISABLE KEYS */;
INSERT INTO `tbldept` VALUES (1,'Aerospace Engineering and Applied Mechanics '),(2,'Civil Engineering'),(3,'Computer Science and Technology'),(4,'Electrical Engineering'),(5,'Electronics and Telecommunication'),(6,'Information Technology'),(7,'Mechanical Engineering'),(8,'Metallurgy and Materials Engineering'),(9,'Mining Engineering');
/*!40000 ALTER TABLE `tbldept` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblhostel`
--

DROP TABLE IF EXISTS `tblhostel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblhostel` (
  `hostelID` int NOT NULL AUTO_INCREMENT,
  `hostelNo` int NOT NULL,
  `hostelWarden` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`hostelID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblhostel`
--

LOCK TABLES `tblhostel` WRITE;
/*!40000 ALTER TABLE `tblhostel` DISABLE KEYS */;
INSERT INTO `tblhostel` VALUES (1,14,'Prof Aniruddha Nath');
/*!40000 ALTER TABLE `tblhostel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblhostelroom`
--

DROP TABLE IF EXISTS `tblhostelroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblhostelroom` (
  `hostelRoomID` int NOT NULL AUTO_INCREMENT,
  `hostelID` int DEFAULT NULL,
  `roomNo` int DEFAULT NULL,
  `floorNo` int DEFAULT NULL,
  PRIMARY KEY (`hostelRoomID`),
  KEY `hostelID` (`hostelID`),
  CONSTRAINT `tblhostelroom_ibfk_1` FOREIGN KEY (`hostelID`) REFERENCES `tblhostel` (`hostelID`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblhostelroom`
--

LOCK TABLES `tblhostelroom` WRITE;
/*!40000 ALTER TABLE `tblhostelroom` DISABLE KEYS */;
INSERT INTO `tblhostelroom` VALUES (1,1,201,1),(2,1,202,1),(3,1,301,2),(4,1,302,2),(5,1,401,3),(6,1,402,3),(7,1,203,1),(8,1,204,1),(9,1,205,1),(10,1,206,1),(11,1,207,1),(12,1,208,1),(13,1,209,1),(14,1,210,1),(15,1,211,1),(16,1,212,1),(17,1,303,2),(18,1,304,2),(19,1,305,2),(20,1,306,2),(21,1,307,2),(22,1,308,2),(23,1,309,2),(24,1,310,2),(25,1,311,2),(26,1,312,2),(27,1,403,3),(28,1,404,3),(29,1,405,3),(30,1,406,3),(31,1,407,3),(32,1,408,3),(33,1,409,3),(34,1,410,3),(35,1,411,3),(36,1,412,3);
/*!40000 ALTER TABLE `tblhostelroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblstudent`
--

DROP TABLE IF EXISTS `tblstudent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblstudent` (
  `studentID` bigint NOT NULL AUTO_INCREMENT,
  `LastName` varchar(50) NOT NULL,
  `MiddleName` varchar(50) DEFAULT NULL,
  `FirstName` varchar(50) NOT NULL,
  `DOB` datetime DEFAULT NULL,
  `mobileNo` varchar(12) NOT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `deptNo` int DEFAULT NULL,
  `guardianContactNo` varchar(12) DEFAULT NULL,
  `enrollmentNo` varchar(50) NOT NULL,
  `isVegeterian` tinyint(1) DEFAULT NULL,
  `medicalCondition` varchar(50) DEFAULT NULL,
  `userID` bigint DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`studentID`),
  UNIQUE KEY `enrollmentNo` (`enrollmentNo`),
  UNIQUE KEY `userID` (`userID`),
  KEY `deptNo` (`deptNo`),
  CONSTRAINT `FK_User_Student` FOREIGN KEY (`userID`) REFERENCES `tbluser` (`userID`),
  CONSTRAINT `tblstudent_ibfk_1` FOREIGN KEY (`deptNo`) REFERENCES `tbldept` (`deptNo`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblstudent`
--

LOCK TABLES `tblstudent` WRITE;
/*!40000 ALTER TABLE `tblstudent` DISABLE KEYS */;
INSERT INTO `tblstudent` VALUES (1,'Doe','John','Michael','2000-05-04 00:00:00','9876543210','Male',1,'72829394943','2024AMB002',1,'None',NULL,'sss@gmail.com'),(2,'gadha','hi','john','2000-05-09 00:00:00','9876543211','M',3,'87384783483','2024CSB001',1,'None',NULL,'ds@gmail.com'),(3,'Doe','hello','Michael','2000-05-11 00:00:00','9876543210','M',6,'9876543211','2024EEBB001',1,'None',NULL,'jdhsjhj@gmail.com'),(4,'Manna','','Soham','2020-12-06 00:00:00','8178136380','Male',6,'6726767271','2024ITB025',1,'None',NULL,'s2@gmail.com'),(5,'helo','','mayank','2025-12-04 00:00:00','3617318281','Male',5,'7372837823','2024ETB055',1,'None',NULL,''),(6,'Manna','','Mousumi','2025-12-12 00:00:00','8183392291','Female',3,'7389391221','2024CSB004',0,'None',NULL,'mousumi.manna@gmail.com'),(7,'Doe',NULL,'John','2000-05-01 00:00:00','9876543210',NULL,NULL,NULL,'ENR001',NULL,NULL,1,NULL),(22,'Saha','','j2oioi2','2025-12-25 00:00:00','3138938241','Male',7,'3138938242','fsfmw,rmm',1,'None',4,'jwhuwh@gmail.com'),(23,'Manna','','Somnath','2025-12-10 00:00:00','8183839330','Male',3,'8183839331','2024CSB030',1,'None',5,'soham.manna275@gmail.com'),(24,'Das','','Samrat','2025-12-01 00:00:00','7501839890','Male',4,'7501839890','2024EEB010',1,'None',6,'2024eeb010.samrat@students.iiests.ac.in');
/*!40000 ALTER TABLE `tblstudent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblstudentroom`
--

DROP TABLE IF EXISTS `tblstudentroom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblstudentroom` (
  `studentID` bigint NOT NULL,
  `hostelRoomID` int NOT NULL,
  `assignedOn` datetime DEFAULT CURRENT_TIMESTAMP,
  `assignedBy` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`studentID`),
  KEY `hostelRoomID` (`hostelRoomID`),
  CONSTRAINT `tblstudentroom_ibfk_1` FOREIGN KEY (`studentID`) REFERENCES `tblstudent` (`studentID`),
  CONSTRAINT `tblstudentroom_ibfk_2` FOREIGN KEY (`hostelRoomID`) REFERENCES `tblhostelroom` (`hostelRoomID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblstudentroom`
--

LOCK TABLES `tblstudentroom` WRITE;
/*!40000 ALTER TABLE `tblstudentroom` DISABLE KEYS */;
INSERT INTO `tblstudentroom` VALUES (1,19,'2025-12-15 14:39:34',NULL),(2,2,'2025-12-16 02:04:01',NULL),(3,28,'2025-12-16 03:57:55',NULL),(5,25,'2025-12-17 13:11:10',NULL);
/*!40000 ALTER TABLE `tblstudentroom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbluser`
--

DROP TABLE IF EXISTS `tbluser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbluser` (
  `userID` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `pass` varchar(255) DEFAULT NULL,
  `role` enum('student','staff','admin') DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT '1',
  `refreshToken` varchar(255) DEFAULT NULL,
  `resetToken` varchar(255) DEFAULT NULL,
  `resetTokenExpiry` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userID`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbluser`
--

LOCK TABLES `tbluser` WRITE;
/*!40000 ALTER TABLE `tbluser` DISABLE KEYS */;
INSERT INTO `tbluser` VALUES (1,'john.doe@student.com','$2b$10$wDFeh8Un22l9bYmMJQLSjO8OOdBdsxgGGRnylhBM8wmgPrwG7C/AS','student',NULL,1,NULL,NULL,NULL,'2025-12-16 13:58:21','2025-12-16 13:58:21'),(2,'soham@admin.com','$2b$10$0yMWvg6Z8iRrmojsNE7cReaFwkbD1uC0hFgIkUUlhrukkIZMnAJsu','admin',NULL,1,NULL,'74dd7d2ab8e4618170d37263915b6d3db05bcd7f607942c68ea5814d5a1a5186','2025-12-17 21:51:16','2025-12-17 01:24:17','2025-12-17 21:36:16'),(3,'ahhs@gmail.com',NULL,'student',NULL,1,NULL,NULL,NULL,'2025-12-17 15:14:57','2025-12-17 15:14:57'),(4,'jwhuwh@gmail.com',NULL,'student',NULL,1,NULL,NULL,NULL,'2025-12-17 15:16:22','2025-12-17 15:16:22'),(5,'soham.manna275@gmail.com','$2b$10$s05VHkq6ZoeKUolxtfjfhe98p5WgTtH6I4KYVFas6qJqoNnaBDcFq','student',NULL,1,NULL,'5f5c85a745fead5b6255f14fe0349b5a59e8ef046d78c82277ae6d8652fc2e74','2025-12-18 18:47:37','2025-12-17 21:43:45','2025-12-18 18:32:37'),(6,'2024eeb010.samrat@students.iiests.ac.in',NULL,'student',NULL,1,NULL,'4a34cf9607ecea8cda7704b9d1e1d5b2b314c9d1f46ec32473950d68eb591444','2025-12-18 18:53:47','2025-12-18 18:37:19','2025-12-18 18:38:47');
/*!40000 ALTER TABLE `tbluser` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-25 16:20:53
