/*
 * Copyright 2012-2013 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package kr.mojito.maldive.oneshot._bootstrap;

import java.io.File;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.convert.converter.Converter;

import kr.mojito.maldive.oneshot.app.message.model.Message;
import kr.mojito.maldive.oneshot.app.message.repository.MessageRepository;
import kr.mojito.maldive.oneshot.app.message.repository.impl.InMemoryMessageRespository;

//@Configuration
//@ComponentScan
//@EnableAutoConfiguration
@SpringBootApplication(scanBasePackages="kr.mojito.maldive.oneshot")
public class MojitoMaldiveWebApplication {
	private final Logger logger = LoggerFactory.getLogger(this.getClass());

	@Bean
	public MessageRepository messageRepository() {
		return new InMemoryMessageRespository();
	}



	@Bean
	public Converter<String, Message> messageConverter() {
		return new Converter<String, Message>() {
			@Override
			public Message convert(String id) {
				return messageRepository().findMessage(Long.valueOf(id));
			}
		};
	}

	@Value("${spring.datasource.url}")
	private String spring_datasource_url;

	@PostConstruct
	public void postConstruct() {
		{
			logger.info(" >> Current Boot Path : "    + new File("./").getAbsolutePath() +" <<");
		}

		// Database file check
		if (spring_datasource_url != null) {
			int lidx = spring_datasource_url.lastIndexOf(":");
			if (lidx>-1) { spring_datasource_url = spring_datasource_url.substring(lidx+1); }

			logger.info(" >> spring.datasource.url : "       + spring_datasource_url                    +" <<");
			logger.info(" >> spring.datasource.url exists : "+ new File(spring_datasource_url).exists() +" <<");
		}

	}

	public static void main(String[] args) throws Exception {


		SpringApplication.run(MojitoMaldiveWebApplication.class, args);
	}

}
