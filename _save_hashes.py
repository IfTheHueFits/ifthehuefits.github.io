import os
import json
import yaml
import re
import glob
from PIL import Image

galleries = ["./_data/gallery.yml",
			 "./_data/warhammerfest23.yml"]

outputs = ["./assets/js/pictures.json",
		   "./assets/images/2023-05-09-warhammerfest23/gallery.json"]

for i,j in zip(galleries, outputs):
	with open(i) as file:
		imgdata = [{"filename": file} for file in yaml.load(file, Loader=yaml.FullLoader)["filenames"]]

	# search the generated site for the hash that is added to the end to reduce
	# recompilation in jekyll_picture_tag

	os.chdir("./_site/generated/images/")
	for file in imgdata:
		try:
			fp = file["filename"].split('.')[0]
			searched_fp = glob.glob(fp + '*', recursive=True)
			fn = fp.split('/')[-1]
			for i in searched_fp:
				if i.split('/')[-1].split('-')[0] == fn:
					genfp = i
					break
			file["hash"] = genfp.split('-')[-1].split('.')[0]
		except IndexError as e:
			print(file["filename"] + " not in use... skipping")
		except NameError as e:
			print(file["filename"] + " not found in list... skipping")

	os.chdir("../../../")
	for file in imgdata:
		img = Image.open("./assets/images/{}".format(file["filename"]))

		# iPhone photos have additional exif data that transposes the image so
		# need to check that the aspect ratio the right way around
		if img._getexif().get(274,0) < 5:
			file["aspectRatio"] = img.size[0]/img.size[1]
		else:
			file["aspectRatio"] = img.size[1]/img.size[0]
		exif = img._getexif()

	with open(j, 'w') as outfile:
		json.dump(imgdata, outfile)

	print("Success, data saved in " + j)
