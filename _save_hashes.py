import os
import json
import yaml
import re
from PIL import Image

# get list of images in the gallery
with open("./_data/gallery.yml") as file:
	imgdata = [{"filename": file} for file in yaml.load(file, Loader=yaml.FullLoader)["filenames"]]

# search the generated site for the hash that is added to the end to reduce
# recompilation in jekyll_picture_tag

# counter keeps track of number of hashes found a breaks when all found
counter = 0
entries = os.scandir("./_site/generated/assets/images/warhammer")
for entry in entries:
	for file in imgdata:
		if file["filename"].split('/')[-1] == re.sub(r'-[0-9]+-[0-9a-f]{9}\.jpg', '', entry.name):
			if "hash" not in file.keys():
				file["hash"] = entry.name.split('-')[-1].split('.')[0]
				counter += 1
			break
	if counter == len(imgdata):
		break

print(imgdata)

for file in imgdata:
	img = Image.open("./assets/images/{}.jpg".format(file["filename"]))
	file["aspectRatio"] = img.size[0]/img.size[1]

with open("./assets/js/pictures.json", 'w') as outfile:
	json.dump(imgdata, outfile)


