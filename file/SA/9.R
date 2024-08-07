#########################################################
#                                                       #
# Spatial Analysis (Geog 2017; NTU Geography)           #
#                                                       #
# Lecture 9: Spatial Autocorrelation                    #
#                                                       #
# Instructor: Dr. Tzai-Hung Wen                         #
#                                                       #
#########################################################

rm(list = ls())
library(spdep)
library(sf)
library(tmap)

setwd("C:/Wen_Files/SA_2021/Data")
TWPOP_sf <- st_read("Popn_TWN2.shp",options = "encoding=Big5" )

ID<- TWPOP_sf$COUNTY_ID
Sel<- ID == "65000" | ID == "63000" 
NorthTW_sf<- TWPOP_sf[Sel,]
length(NorthTW_sf)
NorthTW_lyr <- tm_shape(NorthTW_sf)+tm_polygons(col="grey")


############################
#
#  Define Spatial Neighbors
#
############################

### 1. Contiguity: QUEEN vs. ROOK

#?poly2nb: Construct neighbours list 
TWN_nb<-poly2nb(NorthTW_sf) #QUEEN = TRUE
summary(TWN_nb)

TWN_nb2<-poly2nb(NorthTW_sf,queen=FALSE ) # ROOK

# 1.1. Finding neighbors of a district
TWN_nb[1]

# 1-2 Buiding Neighborhood Matrix
TWN_nb_w.mat <- nb2mat(TWN_nb, style="B")
# style = B is the basic binary coding, 
# W is row standardised, C is globally standardised

# 1.3. Plot the Neighborhood Matrix
coords_sf<-st_centroid(NorthTW_sf)
coords_lyr <- tm_shape(coords_sf)+tm_dots(col="red", size=0.3)
NorthTW_lyr + coords_lyr

TW.centroid <- st_centroid(NorthTW_sf)
TW.coords <- st_coordinates(TW.centroid)
TW.net <- nb2lines(TWN_nb,coords=TW.coords)
TW.net_sf <- st_as_sf(TW.net)
st_crs(TW.net_sf) <-  st_crs(TWPOP_sf)

NorthTW_lyr + coords_lyr + 
  tm_shape(TW.net_sf) + tm_lines(col='red')

### 2. K-nearest Neighbors (KNN)

IDs <-NorthTW_sf$TOWN_ID
TWN_kn1<-knn2nb(knearneigh(TW.coords, k=2), row.names=IDs)
TWN_kn1[1]

TW.net <- nb2lines(TWN_kn1,coords=TW.coords)
TW.net_sf <- st_as_sf(TW.net)
st_crs(TW.net_sf) <-  st_crs(TWPOP_sf)

NorthTW_lyr + coords_lyr + 
  tm_shape(TW.net_sf) + tm_lines(col='red')


### 3. Distance-based (fixed distance band)

TWN_ran1<-dnearneigh(TW.coords, d1=0, d2=20000, row.names=IDs)
TW.net <- nb2lines(TWN_ran1,coords=TW.coords)
TW.net_sf <- st_as_sf(TW.net)
st_crs(TW.net_sf) <-  st_crs(TWPOP_sf)

NorthTW_lyr + coords_lyr + 
  tm_shape(TW.net_sf) + tm_lines(col='red')


#######################################################
#
#  From Spatial Neighbors to ListW (Weighting matrix) 
#
#######################################################

TWN_nb_w<- nb2listw(TWN_nb, zero.policy=T) # default: style = "W" (row standardised)
TWN_nb_w$weight[1]


#######################################################
#
# Spatial Autocorrelation: Moran I & General G Statistics
#
#######################################################

Popn<-NorthTW_sf$A65UP_CNT
NorthTW_sf$Density<- Popn * 10^6 / st_area(NorthTW_sf)


# 1. Mapping the attribute
tm_shape(NorthTW_sf) + 
  tm_polygons("Density", palette = "OrRd", style = "jenks", title = "Elder Density")

# 2.Moran I Statistic
Density <- NorthTW_sf$Density
Density <- as.vector(Density)
M <- moran.test(Density, listw=TWN_nb_w, zero.policy=T)

# 3.Monte-Carlo simulation of Moran I
bperm <- moran.mc(Density,listw=TWN_nb_w,nsim=999)
hist(bperm$res, freq=TRUE, breaks=20, xlab="Simulated Moran's I")
abline(v=0.486, col="red")

# 4.Moran Spatial Correlogram
cor<-sp.correlogram(TWN_nb, Density, order=3, method="I", style="W")
print(cor); plot(cor)

# 5.Moran Scatter Plot
nci <- moran.plot (Density, TWN_nb_w, labels=IDs , xlab="Popn", ylab="SL Popn")

# 6.Getis-Ord General G Statistic
TWN_ran1_wb <- nb2listw(TWN_ran1, style="B", zero.policy=T)
G <- globalG.test(Density, listw=TWN_ran1_wb)


