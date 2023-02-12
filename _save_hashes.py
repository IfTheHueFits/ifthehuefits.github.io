import os
import json
import yaml
import re
import glob
from PIL import Image

# NOTE: MAKE SURE THAT FILE TYPE IS NOT INCLUDED ON THE END OF THE GALLERY.YML FILE
# get list of images in the gallery
with open("./_data/gallery.yml") as file:
	imgdata = [{"filename": file} for file in yaml.load(file, Loader=yaml.FullLoader)["filenames"]]

# search the generated site for the hash that is added to the end to reduce
# recompilation in jekyll_picture_tag

os.chdir("./_site/generated/images/")
for file in imgdata:
	try:
		genfp = glob.glob(file["filename"]+ "*", recursive=True)[0]
		file["hash"] = genfp.split('-')[-1].split('.')[0]
	except IndexError as e:
		print(file["filename"] + " not in use... skipping")

os.chdir("../../../")
for file in imgdata:
	img = Image.open("./assets/images/{}.jpg".format(file["filename"]))
	file["aspectRatio"] = img.size[0]/img.size[1]

with open("./assets/js/pictures.json", 'w') as outfile:
	json.dump(imgdata, outfile)

print("Success, data saved in /assets/js/picture.json")
