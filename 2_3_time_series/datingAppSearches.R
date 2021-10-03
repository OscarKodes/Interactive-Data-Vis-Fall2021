
## Clear everything
rm(list = ls())

## Set working directory
setwd("C:/Users/Oscar Ko/Desktop/Interactive-Data-Vis-Fall2021/2_3_time_series")

## Check working directory
getwd()

## Import data
data <- read.csv("datingAppSearches.csv")

## Examine data
head(data)
tail(data)
str(data)
colnames(data)

## library
library(tidyverse)

## Get only Tinder rows
tinder <- select(data, Week, Tinder)
tinder$app <- rep("Tinder", nrow(data))
colnames(tinder)[2] <- "searches"

## Get only Bumble rows
bumble <- select(data, Week, Bumble)
bumble$app <- rep("Bumble", nrow(data))
colnames(bumble)[2] <- "searches"

## Get only okcupid rows
okcupid <- select(data, Week, Okcupid)
okcupid$app <- rep("okcupid", nrow(data))
colnames(okcupid)[2] <- "searches"

## Get only hinge rows
hinge <- select(data, Week, Hinge)
hinge$app <- rep("hinge", nrow(data))
colnames(hinge)[2] <- "searches"

## Get only cmb rows
cmb <- select(data, Week, Coffee.Meets.Bagel)
cmb$app <- rep("cmb", nrow(data))
colnames(cmb)[2] <- "searches"

## Stack all the rows ontop of each other
final.data <- rbind(tinder, bumble, okcupid, cmb, hinge)

final.data$searches <- as.integer(final.data$searches)
final.data$searches <- replace(final.data$searches, is.na(final.data$searches), 0.5)

head(final.data)
tail(final.data)
str(final.data)


# Export dataframe to CSV
write.csv(final.data, "appSearches.csv", row.names = T)
